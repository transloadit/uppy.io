import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
	parseAccept,
	markdownType,
	prefersJson,
	markdownUrl,
	jsonError,
	markdownError,
	mergeVary,
} from '../worker/index.js';
import worker from '../worker/index.js';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const buildDir = path.join(root, 'build');

describe('Accept parsing', () => {
	test('orders media types by q-value, dropping q=0', () => {
		assert.deepEqual(
			parseAccept('text/html;q=0.8, text/markdown;q=0.9, image/png;q=0'),
			['text/markdown', 'text/html'],
		);
	});

	test('keeps source order when q-values tie', () => {
		assert.deepEqual(parseAccept('text/html, text/markdown'), [
			'text/html',
			'text/markdown',
		]);
	});

	test('an absent header yields nothing', () => {
		assert.deepEqual(parseAccept(null), []);
	});
});

describe('markdown negotiation', () => {
	test('serves markdown when it is asked for explicitly', () => {
		assert.equal(markdownType('text/markdown'), 'text/markdown');
	});

	test('serves markdown when it outranks html', () => {
		assert.equal(
			markdownType('text/html;q=0.8, text/markdown;q=0.9'),
			'text/markdown',
		);
	});

	// The regression that matters: a browser must never be handed markdown.
	test('a browser Accept header still gets html', () => {
		assert.equal(
			markdownType(
				'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
			),
			null,
		);
	});

	test('a bare wildcard is not a request for markdown', () => {
		assert.equal(markdownType('*/*'), null);
	});

	// RFC 9110: q is case-insensitive, and q=0 means "explicitly unacceptable".
	test('an uppercase Q=0 excludes markdown', () => {
		assert.equal(markdownType('text/markdown;Q=0, text/html'), null);
	});

	// The client gets the media type it asked for, not our favourite label.
	test('a text/plain request is answered as text/plain', () => {
		assert.equal(markdownType('text/plain'), 'text/plain');
	});

	test('json clients are not handed markdown, and vice versa', () => {
		assert.equal(markdownType('application/json'), null);
		assert.equal(prefersJson('application/json'), true);
		assert.equal(prefersJson('text/html,*/*;q=0.8'), false);
	});
});

describe('Vary merging', () => {
	test('appends to the origin value instead of clobbering it', () => {
		const h = new Headers({ vary: 'Origin' });
		mergeVary(h, 'Accept', 'Accept-Encoding');
		assert.equal(h.get('vary'), 'Origin, Accept, Accept-Encoding');
	});

	test('does not duplicate an already-listed member', () => {
		const h = new Headers({ vary: 'accept-encoding' });
		mergeVary(h, 'Accept', 'Accept-Encoding');
		assert.equal(h.get('vary'), 'Accept-Encoding, Accept');
	});
});

describe('markdown twin URLs', () => {
	test('appends .md, collapsing the trailing slash', () => {
		assert.equal(
			markdownUrl('https://uppy.io/docs/quick-start/'),
			'https://uppy.io/docs/quick-start.md',
		);
	});

	test('handles a path with no trailing slash', () => {
		assert.equal(
			markdownUrl('https://uppy.io/docs/companion'),
			'https://uppy.io/docs/companion.md',
		);
	});
});

describe('JSON errors', () => {
	test('a 404 carries a code, a message, a hint and Vary: Accept', async () => {
		const res = jsonError(404, 'https://uppy.io/nope');

		assert.equal(res.status, 404);
		assert.equal(
			res.headers.get('content-type'),
			'application/json; charset=utf-8',
		);
		assert.equal(res.headers.get('vary'), 'Accept, Accept-Encoding');

		const { error } = await res.json();
		assert.equal(error.code, 'not_found');
		assert.equal(error.status, 404);
		assert.match(error.message, /\/nope/);
		assert.match(error.resolution, /llms\.txt/);
	});

	test('load-bearing origin headers survive the body swap', () => {
		const origin = new Response(null, {
			status: 429,
			headers: { 'retry-after': '30', vary: 'Origin' },
		});
		const res = jsonError(429, 'https://uppy.io/x', origin);
		assert.equal(res.headers.get('retry-after'), '30');
		assert.match(res.headers.get('vary'), /Accept/);
	});

	test('a markdown 404 is markdown, with recovery links', async () => {
		const res = markdownError(404, 'text/markdown');
		assert.equal(res.status, 404);
		assert.match(res.headers.get('content-type'), /text\/markdown/);
		const body = await res.text();
		assert.match(body, /^# Page not found/);
		assert.match(body, /llms\.txt/);
	});

	test('410 and 403 do not advise retrying', async () => {
		const gone = (await jsonError(410, 'https://uppy.io/x').json()).error;
		assert.equal(gone.code, 'gone');
		assert.match(gone.resolution, /permanently removed/);
		assert.ok(!/retry/i.test(gone.resolution));
		const forbidden = (await jsonError(403, 'https://uppy.io/x').json()).error;
		assert.match(forbidden.resolution, /will not succeed/);
	});

	test('unmapped statuses still produce a structured body', async () => {
		const { error } = await jsonError(503, 'https://uppy.io/x').json();
		assert.equal(error.code, 'http_error');
		assert.equal(error.status, 503);
	});
});

// These assert on real build output. They are the check that the Docusaurus
// plugin actually ran, so they only make sense once `yarn build` has.
describe(
	'build output',
	{ skip: !fs.existsSync(buildDir) && 'run `yarn build` first' },
	() => {
		const read = (p) => fs.readFileSync(path.join(buildDir, p), 'utf8');

		test('robots.txt points at the sitemap', () => {
			assert.match(
				read('robots.txt'),
				/^Sitemap: https:\/\/uppy\.io\/sitemap\.xml$/m,
			);
		});

		test('llms.txt follows the llmstxt.org shape', () => {
			const llms = read('llms.txt');
			assert.match(llms, /^# Uppy\n/);
			assert.match(llms, /^> .+/m); // summary blockquote
			assert.match(llms, /^## Documentation$/m);
			assert.match(llms, /^- \[.+\]\(https:\/\/uppy\.io\/docs\/.+\.md\)/m);
		});

		test('llms.txt links only to markdown twins that exist', () => {
			const links = [
				...read('llms.txt').matchAll(
					/\(https:\/\/uppy\.io(\/docs\/\S+?\.md)\)/g,
				),
			];
			assert.ok(
				links.length > 10,
				`expected many doc links, got ${links.length}`,
			);
			for (const [, route] of links) {
				assert.ok(
					fs.existsSync(path.join(buildDir, route.replace(/^\//, ''))),
					`llms.txt links to ${route} but no such file was built`,
				);
			}
		});

		test('llms-full.txt inlines the documentation body', () => {
			const full = read('llms-full.txt');
			assert.ok(
				full.length > 50_000,
				`expected full docs, got ${full.length} chars`,
			);
			assert.match(full, /^Source: https:\/\/uppy\.io\/docs\//m);
		});

		test('a markdown twin carries prose, not frontmatter', () => {
			const md = read('docs/quick-start.md');
			assert.ok(!md.startsWith('---'), 'frontmatter should be stripped');
			assert.match(md, /^# .+/);
			assert.ok(md.length > 500);
		});

		test('no twin leaks its MDX import preamble', () => {
			const twins = fs
				.readdirSync(path.join(buildDir, 'docs'), { recursive: true })
				.filter((f) => typeof f === 'string' && f.endsWith('.md'));
			assert.ok(twins.length > 40, `expected many twins, got ${twins.length}`);

			for (const twin of twins) {
				const body = read(path.join('docs', twin));
				const firstLine = body.split('\n', 1)[0];
				assert.ok(
					!/^\s*(import|export)\s/.test(firstLine),
					`${twin} starts with an MDX statement: ${firstLine}`,
				);
				// `import` inside a fenced example is documentation and must survive.
				assert.equal(
					(body.match(/^# /gm) ?? []).length >= 1,
					true,
					`${twin} has no H1`,
				);
			}
		});

		test('a twin does not repeat its title twice', () => {
			const md = read('docs/quick-start.md');
			assert.equal((md.match(/^# Quick start$/gm) ?? []).length, 1);
		});

		test('fenced code examples keep their import lines', () => {
			assert.match(
				read('docs/angular.md'),
				/```typescript[\s\S]*?^import \{ NgModule \}/m,
			);
		});

		test('openapi.json is a valid 3.1 document describing this site', () => {
			const spec = JSON.parse(read('openapi.json'));
			assert.equal(spec.openapi, '3.1.0');
			assert.equal(spec.servers[0].url, 'https://uppy.io');
			assert.ok(spec.info.title && spec.info.version);
			for (const p of [
				'/docs/{slug}',
				'/docs/{slug}.md',
				'/llms.txt',
				'/sitemap.xml',
			]) {
				assert.ok(spec.paths[p]?.get, `spec is missing GET ${p}`);
			}
		});

		// The spec must not promise pages the build did not produce.
		test('every slug the spec enumerates was actually built', () => {
			const spec = JSON.parse(read('openapi.json'));
			const slugs = spec.paths['/docs/{slug}.md'].get.parameters[0].schema.enum;
			assert.ok(slugs.length > 40, `expected many slugs, got ${slugs.length}`);

			for (const slug of slugs) {
				assert.ok(
					fs.existsSync(path.join(buildDir, 'docs', `${slug}.md`)),
					`spec lists ${slug} but docs/${slug}.md was not built`,
				);
				assert.ok(
					fs.existsSync(path.join(buildDir, 'docs', slug, 'index.html')),
					`spec lists ${slug} but docs/${slug}/ was not built`,
				);
			}
		});

		test('the spec and llms.txt agree on the page set', () => {
			const spec = JSON.parse(read('openapi.json'));
			const slugs = new Set(
				spec.paths['/docs/{slug}.md'].get.parameters[0].schema.enum,
			);
			// Nested slugs and the root docs page live as literal path items:
			// a single {slug} parameter cannot span a `/` or be empty.
			const literal = new Set(Object.keys(spec.paths));
			const linked = [
				...read('llms.txt').matchAll(/https:\/\/uppy\.io(\/docs\S*?\.md)\)/g),
			].map(([, route]) => route);
			assert.ok(
				linked.length > 40,
				`expected many links, got ${linked.length}`,
			);
			for (const route of linked) {
				const slug = route.replace(/^\/docs\//, '').replace(/\.md$/, '');
				assert.ok(
					slugs.has(slug) || literal.has(route),
					`llms.txt links ${route} but the spec omits it`,
				);
			}
		});

		test('no slug in the {slug} enum contains a path separator', () => {
			const spec = JSON.parse(read('openapi.json'));
			for (const p of ['/docs/{slug}', '/docs/{slug}.md']) {
				for (const slug of spec.paths[p].get.parameters[0].schema.enum) {
					assert.ok(!slug.includes('/'), `${p} enum has multi-segment ${slug}`);
				}
			}
		});

		test('the root docs page and nested pages are literal spec paths', () => {
			const spec = JSON.parse(read('openapi.json'));
			for (const p of [
				'/docs/',
				'/docs.md',
				'/docs/guides/building-plugins.md',
			]) {
				assert.ok(spec.paths[p]?.get, `spec is missing literal path ${p}`);
			}
		});

		test('twins inline their MDX partials instead of leaving JSX stubs', () => {
			// These partials hold whole documentation sections; a leftover
			// self-closing tag means the content was silently dropped.
			for (const [twin, tag, expected] of [
				['docs/react.md', '<HooksShared', 'useDropzone'],
				['docs/dropbox.md', '<CompanionOptions', 'companionUrl'],
			]) {
				const body = read(twin);
				assert.ok(!body.includes(tag), `${twin} still contains ${tag}`);
				assert.ok(body.includes(expected), `${twin} lost partial content`);
			}
		});

		test('JSX is demoted to markdown, not left raw in twins', () => {
			// Tab wrappers become labels, CDN examples become real code fences,
			// QuickStartLinks becomes a link list, and anything unrenderable is
			// an explicit pointer to the rendered page -- never silent omission.
			const tus = read('docs/tus.md');
			assert.ok(!tus.includes('<Tabs'), 'tus.md still has <Tabs');
			assert.ok(!tus.includes('<UppyCdnExample'), 'CDN example not rendered');
			assert.match(tus, /^\s*\*\*NPM\*\*$/m);
			assert.match(
				tus,
				/releases\.transloadit\.com\/uppy\/v\d+\.\d+\.\d+\/uppy\.min\.css/,
			);

			const qs = read('docs/quick-start.md');
			assert.ok(!qs.includes('<QuickStartLinks'), 'links not rendered');
			assert.match(
				qs,
				/- \[I want a full featured, extendable UI\]\(\/docs\/dashboard\)/,
			);

			const react = read('docs/react.md');
			assert.ok(
				!/^\s*<[A-Z][A-Za-z]*Demo \/>/m.test(react),
				'raw demo tag left',
			);
			assert.match(
				react,
				/Interactive content omitted from the Markdown version/,
			);
			// Inline code spans naming components are prose and must survive.
			assert.ok(
				react.includes('`<Dashboard />`'),
				'inline code span was mangled',
			);
		});

		test('no unresolved JSX remains outside code in any twin', () => {
			const twins = fs
				.readdirSync(path.join(buildDir, 'docs'), { recursive: true })
				.filter((f) => typeof f === 'string' && f.endsWith('.md'));
			for (const twin of twins) {
				const body = read(path.join('docs', twin))
					.replace(/```[\s\S]*?```/g, '')
					.replace(/`[^`\n]*`/g, '');
				// Generic type prose such as Array<Object> is fine; JSX tags with
				// attributes or self-closing syntax are not.
				const jsx =
					body.match(/<[A-Z][A-Za-z]*(\s[^<>]*)?\/?>(?![A-Za-z]*>)/g) ?? [];
				const real = jsx.filter((t) => /[\s/]>$|\/>$/.test(t));
				assert.deepEqual(real, [], `${twin} has unresolved JSX: ${real}`);
			}
		});

		test('the 404 page gives agents somewhere to go', () => {
			const html = read('404.html');
			for (const target of ['/llms.txt', '/sitemap.xml', '/docs/quick-start']) {
				assert.ok(html.includes(target), `404 page should link to ${target}`);
			}
			const text = html
				.replace(/<(script|style)[\s\S]*?<\/\1>/g, '')
				.replace(/<[^>]+>/g, ' ')
				.replace(/\s+/g, ' ')
				.trim();
			assert.ok(
				text.length > 500,
				`404 body text too thin: ${text.length} chars`,
			);
		});

		test('JSON-LD is emitted site-wide and parses', () => {
			for (const page of [
				'index.html',
				'404.html',
				'docs/quick-start/index.html',
			]) {
				const html = read(page);
				const match =
					/<script type="application\/ld\+json">([\s\S]*?)<\/script>/.exec(
						html,
					);
				assert.ok(match, `${page} has no JSON-LD block`);

				const graph = JSON.parse(match[1])['@graph'];
				const types = graph.map((n) => n['@type']);
				for (const type of ['Organization', 'WebSite', 'SoftwareApplication']) {
					assert.ok(types.includes(type), `${page} JSON-LD is missing ${type}`);
				}
			}
		});

		test('the SoftwareApplication node carries the fields agents look for', () => {
			const html = read('index.html');
			const graph = JSON.parse(
				/<script type="application\/ld\+json">([\s\S]*?)<\/script>/.exec(
					html,
				)[1],
			)['@graph'];
			const app = graph.find((n) => n['@type'] === 'SoftwareApplication');

			for (const field of [
				'name',
				'description',
				'applicationCategory',
				'codeRepository',
				'license',
				'offers',
			]) {
				assert.ok(app[field], `SoftwareApplication is missing ${field}`);
			}
			assert.ok(
				app.description.length > 100,
				'description is too thin to be useful',
			);
			// Cross-reference must resolve inside the graph, or consumers drop it.
			const ids = new Set(graph.map((n) => n['@id']));
			assert.ok(
				ids.has(app.author['@id']),
				'author @id does not resolve in the graph',
			);
		});

		test('the homepage is readable without JavaScript', () => {
			const html = read('index.html');
			assert.match(html, /<h1[^>]*>/);
			assert.match(
				html,
				/<meta[^>]*name="description"[^>]*content="[^"]{50,}"/,
			);
			const text = html
				.replace(/<(script|style|noscript)[\s\S]*?<\/\1>/g, '')
				.replace(/<[^>]+>/g, ' ')
				.replace(/\s+/g, ' ')
				.trim();
			assert.ok(
				text.length > 500,
				`homepage text too thin: ${text.length} chars`,
			);
		});
	},
);

// Exercises the Worker's request handler against a stubbed GitHub Pages origin,
// so the negotiation and error paths are covered without a network or a
// Cloudflare runtime.
describe('worker request handling', () => {
	const origin = (url, init) => {
		const { pathname } = new URL(url);
		if (pathname === '/docs/quick-start.md') {
			if (init?.headers?.['if-none-match'] === '"twin-etag"')
				return new Response(null, {
					status: 304,
					headers: { etag: '"twin-etag"' },
				});
			return new Response('# Quick start\n', {
				status: 200,
				headers: { 'content-type': 'text/plain', etag: '"twin-etag"' },
			});
		}
		if (pathname === '/docs/quick-start/')
			return new Response('<html><h1>Quick start</h1></html>', {
				status: 200,
				headers: { 'content-type': 'text/html; charset=utf-8' },
			});
		if (pathname === '/examples/')
			return new Response('<html><h1>Examples</h1></html>', {
				status: 200,
				headers: { 'content-type': 'text/html; charset=utf-8', vary: 'Origin' },
			});
		if (pathname === '/img/logo.svg')
			return new Response('<svg/>', {
				status: 200,
				headers: { 'content-type': 'image/svg+xml' },
			});
		if (pathname === '/not-modified/')
			return new Response(null, { status: 304 });
		return new Response('<html>Page Not Found</html>', {
			status: 404,
			headers: { 'content-type': 'text/html; charset=utf-8' },
		});
	};

	const call = async (path, accept, method = 'GET', extraHeaders = {}) => {
		const real = globalThis.fetch;
		globalThis.fetch = async (input, init) =>
			origin(typeof input === 'string' ? input : input.url, init);
		try {
			return await worker.fetch(
				new Request(`https://uppy.io${path}`, {
					method,
					headers: { ...(accept ? { accept } : {}), ...extraHeaders },
				}),
			);
		} finally {
			globalThis.fetch = real;
		}
	};

	test('an agent asking for markdown gets the twin, with Vary: Accept', async () => {
		const res = await call('/docs/quick-start/', 'text/markdown');
		assert.equal(res.status, 200);
		assert.equal(
			res.headers.get('content-type'),
			'text/markdown; charset=utf-8',
		);
		assert.equal(res.headers.get('vary'), 'Accept, Accept-Encoding');
		assert.match(await res.text(), /^# Quick start/);
	});

	test('a browser still gets html, and it also varies on Accept', async () => {
		const res = await call('/docs/quick-start/', 'text/html,*/*;q=0.8');
		assert.equal(res.headers.get('content-type'), 'text/html; charset=utf-8');
		assert.equal(res.headers.get('vary'), 'Accept, Accept-Encoding');
		assert.match(await res.text(), /<h1>/);
	});

	test('a missing twin falls back to the html page, which succeeds', async () => {
		const res = await call('/examples/', 'text/markdown');
		assert.equal(res.status, 200);
		assert.match(res.headers.get('content-type'), /text\/html/);
		// The origin's own Vary survives, with Accept appended.
		assert.equal(res.headers.get('vary'), 'Origin, Accept, Accept-Encoding');
	});

	test('a markdown agent hitting a dead path gets a markdown 404', async () => {
		const res = await call('/does-not-exist/', 'text/markdown');
		assert.equal(res.status, 404);
		assert.match(res.headers.get('content-type'), /text\/markdown/);
		assert.match(await res.text(), /llms\.txt/);
	});

	test('a conditional request can earn the twin 304', async () => {
		const res = await call('/docs/quick-start/', 'text/markdown', 'GET', {
			'if-none-match': '"twin-etag"',
		});
		assert.equal(res.status, 304);
		assert.equal(res.body, null);
		assert.match(res.headers.get('vary'), /Accept/);
	});

	test('a POST is never rewritten into the GET twin', async () => {
		const res = await call('/docs/quick-start/', 'text/markdown', 'POST');
		// The stub serves the page for any method; what matters is that the
		// worker passed the POST through instead of fetching the twin.
		assert.match(res.headers.get('content-type'), /text\/html/);
	});

	test('a 304 passes through instead of crashing the error path', async () => {
		const res = await call('/not-modified/', 'application/json');
		assert.equal(res.status, 304);
	});

	test('a json client asking for a missing .json file still gets json', async () => {
		const res = await call('/missing.json', 'application/json');
		assert.equal(res.status, 404);
		assert.match(res.headers.get('content-type'), /application\/json/);
	});

	test('an agent preferring json gets a structured 404', async () => {
		const res = await call('/does-not-exist/', 'application/json');
		assert.equal(res.status, 404);
		assert.match(res.headers.get('content-type'), /application\/json/);
		assert.equal(res.headers.get('vary'), 'Accept, Accept-Encoding');
		const { error } = await res.json();
		assert.equal(error.code, 'not_found');
		assert.match(error.resolution, /llms\.txt/);
	});

	test('a browser 404 stays html', async () => {
		const res = await call('/does-not-exist/', 'text/html,*/*;q=0.8');
		assert.equal(res.status, 404);
		assert.match(res.headers.get('content-type'), /text\/html/);
	});

	test('assets pass through untouched', async () => {
		const res = await call('/img/logo.svg', 'text/markdown');
		assert.equal(res.headers.get('content-type'), 'image/svg+xml');
	});
});
