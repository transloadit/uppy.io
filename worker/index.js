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
			const q = params.map((p) => /^\s*q=([0-9.]+)\s*$/.exec(p)).find(Boolean);
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
 * True when the client asked for Markdown *in preference to* HTML. A browser
 * sending `Accept: text/html,...,* /*` must keep getting HTML.
 */
export function prefersMarkdown(header) {
	for (const type of parseAccept(header)) {
		if (MARKDOWN_TYPES.includes(type)) return true;
		if (type === 'text/html' || type === 'application/xhtml+xml') return false;
	}
	return false;
}

export function prefersJson(header) {
	for (const type of parseAccept(header)) {
		if (type === 'application/json') return true;
		if (type === 'text/html' || type === 'application/xhtml+xml') return false;
	}
	return false;
}

/** Map a page URL to the `.md` twin emitted at build time. */
export function markdownUrl(url) {
	const target = new URL(url);
	target.pathname = `${target.pathname.replace(/\/$/, '')}.md`;
	return target.toString();
}

export function jsonError(status, url) {
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
	return new Response(`${JSON.stringify(body, null, 2)}\n`, {
		status,
		headers: {
			'content-type': 'application/json; charset=utf-8',
			// Same URL, different body per Accept: caches must key on it.
			vary: 'Accept, Accept-Encoding',
		},
	});
}

export default {
	async fetch(request) {
		const accept = request.headers.get('accept');
		const url = new URL(request.url);

		if (PASSTHROUGH.test(url.pathname)) return fetch(request);

		if (prefersMarkdown(accept)) {
			const md = await fetch(markdownUrl(request.url), {
				headers: { 'accept-encoding': 'identity' },
			});
			if (md.ok) {
				const headers = new Headers(md.headers);
				headers.set('content-type', 'text/markdown; charset=utf-8');
				headers.set('vary', 'Accept, Accept-Encoding');
				return new Response(md.body, { status: 200, headers });
			}
			// No twin for this URL: fall through to the HTML response below.
		}

		const response = await fetch(request);

		if (!response.ok && prefersJson(accept)) {
			return jsonError(response.status, request.url);
		}

		// Advertise negotiation on every HTML response, so a cache never serves
		// one variant to a client that asked for the other.
		const headers = new Headers(response.headers);
		headers.set('vary', 'Accept, Accept-Encoding');
		return new Response(response.body, {
			status: response.status,
			statusText: response.statusText,
			headers,
		});
	},
};
