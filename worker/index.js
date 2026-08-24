/**
 * Cloudflare Worker for uppy.io.
 *
 * uppy.io is served by GitHub Pages, which cannot set response headers or run
 * server-side logic. Two agent-readiness behaviours therefore have to live in
 * front of it, in the Cloudflare zone that already proxies the domain:
 *
 *   1. Markdown content negotiation (acceptmarkdown.com). A request carrying
 *      `Accept: text/markdown` for an HTML page is served the `.md` twin that
 *      the `agent-readiness` Docusaurus plugin writes at build time, and every
 *      negotiable response advertises `Vary: Accept`.
 *
 *   2. JSON error responses. A 4xx/5xx for a client that prefers JSON gets a
 *      structured body with a code, a message and a resolution hint instead of
 *      the Docusaurus HTML shell.
 *
 * Deploy with `npx wrangler deploy` from this directory. See README.md.
 */

const MARKDOWN_TYPES = ['text/markdown', 'text/plain'];

// Paths that are already machine-readable or binary; pass straight through.
const PASSTHROUGH =
	/\.(md|txt|xml|json|ico|png|jpe?g|svg|gif|webp|woff2?|css|js|map)$/i;

/**
 * Parse an Accept header into media types ordered by descending q-value.
 * `Accept: text/markdown;q=0.9, text/html;q=0.8` -> ['text/markdown', 'text/html']
 */
export function parseAccept(header) {
	if (!header) return [];
	return header
		.split(',')
		.map((part, index) => {
			const [type, ...params] = part.trim().split(';');
			const q = params.map((p) => /^\s*q=([0-9.]+)\s*$/i.exec(p)).find(Boolean);
			return {
				type: type.trim().toLowerCase(),
				// Ties keep source order, which is what the RFC recommends.
				q: q ? Number.parseFloat(q[1]) : 1,
				index,
			};
		})
		.filter((e) => e.type && e.q > 0)
		.sort((a, b) => b.q - a.q || a.index - b.index)
		.map((e) => e.type);
}

/**
 * The markdown-ish type the client asked for *in preference to* HTML, or null.
 * A browser sending `Accept: text/html,...,* /*` must keep getting HTML.
 * `text/*` is deliberately not treated as a markdown request: HTML satisfies
 * it, and RFC 9110 leaves the choice among acceptable types to the server.
 */
export function markdownType(header) {
	for (const type of parseAccept(header)) {
		if (MARKDOWN_TYPES.includes(type)) return type;
		if (type === 'text/html' || type === 'application/xhtml+xml') return null;
	}
	return null;
}

export function prefersJson(header) {
	for (const type of parseAccept(header)) {
		if (type === 'application/json') return true;
		if (type === 'text/html' || type === 'application/xhtml+xml') return false;
	}
	return false;
}

/** Append members to an existing Vary value without dropping the origin's. */
export function mergeVary(headers, ...names) {
	const seen = new Set(
		(headers.get('vary') ?? '')
			.split(',')
			.map((v) => v.trim().toLowerCase())
			.filter(Boolean),
	);
	for (const name of names) seen.add(name.toLowerCase());
	headers.set(
		'vary',
		[...seen]
			.map((v) => v.replace(/(^|-)./g, (c) => c.toUpperCase()))
			.join(', '),
	);
	return headers;
}

/** Map a page URL to the `.md` twin emitted at build time. */
export function markdownUrl(url) {
	const target = new URL(url);
	target.pathname = `${target.pathname.replace(/\/$/, '')}.md`;
	return target.toString();
}

export function jsonError(status, url, origin) {
	const codes = {
		404: 'not_found',
		410: 'gone',
		403: 'forbidden',
		500: 'internal_error',
	};
	const body = {
		error: {
			code: codes[status] ?? 'http_error',
			status,
			message:
				status === 404 ?
					`No page exists at ${new URL(url).pathname}`
				:	`Request failed with status ${status}`,
			resolution:
				status === 404 ?
					'Check https://uppy.io/llms.txt for the documentation index, or https://uppy.io/sitemap.xml for every URL on this site.'
				:	'Retry the request. If it keeps failing, open an issue at https://github.com/transloadit/uppy.io/issues.',
			documentation: 'https://uppy.io/llms.txt',
		},
	};
	const headers = new Headers({
		'content-type': 'application/json; charset=utf-8',
	});
	// Semantically load-bearing origin headers survive the body swap.
	for (const name of [
		'retry-after',
		'www-authenticate',
		'allow',
		'cache-control',
	]) {
		const value = origin?.headers.get(name);
		if (value) headers.set(name, value);
	}
	// Same URL, different body per Accept: caches must key on it.
	mergeVary(headers, 'Accept', 'Accept-Encoding');
	return new Response(`${JSON.stringify(body, null, 2)}\n`, {
		status,
		headers,
	});
}

const MARKDOWN_404 = `# Page not found

No page exists at this address.

## Where to look next

- [Documentation index](https://uppy.io/llms.txt) — every page, as Markdown
- [Full documentation](https://uppy.io/llms-full.txt) — one file
- [Sitemap](https://uppy.io/sitemap.xml) — every URL on this site
- [Quick start](https://uppy.io/docs/quick-start.md)

Every documentation page is available as Markdown by appending \`.md\` to its
URL, for example \`/docs/quick-start.md\`.
`;

export function markdownError(status, type) {
	const headers = new Headers({
		'content-type': `${type}; charset=utf-8`,
	});
	mergeVary(headers, 'Accept', 'Accept-Encoding');
	return new Response(MARKDOWN_404, { status, headers });
}

export default {
	async fetch(request) {
		const accept = request.headers.get('accept');
		const url = new URL(request.url);

		// Negotiation only ever applies to reads; anything else passes through
		// untouched so methods and conditional semantics are preserved.
		const negotiable =
			(request.method === 'GET' || request.method === 'HEAD') &&
			!PASSTHROUGH.test(url.pathname);
		const mdType = negotiable ? markdownType(accept) : null;

		if (mdType) {
			const md = await fetch(markdownUrl(request.url), {
				headers: { 'accept-encoding': 'identity' },
			});
			if (md.ok) {
				const headers = new Headers(md.headers);
				headers.set('content-type', `${mdType}; charset=utf-8`);
				mergeVary(headers, 'Accept', 'Accept-Encoding');
				return new Response(request.method === 'HEAD' ? null : md.body, {
					status: 200,
					headers,
				});
			}
			// No twin for this URL: fall through to the origin response below.
		}

		const response = await fetch(request);

		// Structured errors for structured clients -- >= 400 only, so valid
		// 3xx responses (a 304 to a conditional request) pass through intact:
		// constructing a bodied 304 would throw in the Workers runtime.
		if (response.status >= 400) {
			if (prefersJson(accept)) {
				return jsonError(response.status, request.url, response);
			}
			if (mdType && response.status === 404) {
				return markdownError(404, mdType);
			}
		}

		if (!negotiable) return response;

		// Advertise negotiation on every negotiable response, so a cache never
		// serves one variant to a client that asked for the other.
		const headers = new Headers(response.headers);
		mergeVary(headers, 'Accept', 'Accept-Encoding');
		return new Response(response.body, {
			status: response.status,
			statusText: response.statusText,
			headers,
		});
	},
};
