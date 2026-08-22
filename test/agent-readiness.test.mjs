import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
	parseAccept,
	prefersMarkdown,
	prefersJson,
	markdownUrl,
	jsonError,
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
		assert.equal(prefersMarkdown('text/markdown'), true);
	});

	test('serves markdown when it outranks html', () => {
		assert.equal(prefersMarkdown('text/html;q=0.8, text/markdown;q=0.9'), true);
	});

	// The regression that matters: a browser must never be handed markdown.
	test('a browser Accept header still gets html', () => {
		assert.equal(
			prefersMarkdown(
				'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
			),
			false,
		);
	});

	test('a bare wildcard is not a request for markdown', () => {
		assert.equal(prefersMarkdown('*/*'), false);
	});

	test('json clients are not handed markdown, and vice versa', () => {
		assert.equal(prefersMarkdown('application/json'), false);
		assert.equal(prefersJson('application/json'), true);
		assert.equal(prefersJson('text/html,*/*;q=0.8'), false);
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
			const linked = [
				...read('llms.txt').matchAll(/https:\/\/uppy\.io\/docs\/(\S+?)\.md\)/g),
			]
				.map(([, slug]) => slug)
				.filter((slug) => slug !== 'docs');
			for (const slug of linked) {
				assert.ok(
					slugs.has(slug),
					`llms.txt links ${slug} but the spec omits it`,
				);
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
	const origin = (url) => {
		const { pathname } = new URL(url);
		if (pathname === '/docs/quick-start.md')
			return new Response('# Quick start\n', {
				status: 200,
				headers: { 'content-type': 'text/plain' },
			});
		if (pathname === '/docs/quick-start/')
			return new Response('<html><h1>Quick start</h1></html>', {
				status: 200,
				headers: { 'content-type': 'text/html; charset=utf-8' },
			});
		if (pathname === '/img/logo.svg')
			return new Response('<svg/>', {
				status: 200,
				headers: { 'content-type': 'image/svg+xml' },
			});
		return new Response('<html>Page Not Found</html>', {
			status: 404,
			headers: { 'content-type': 'text/html; charset=utf-8' },
		});
	};

	const call = async (path, accept) => {
		const real = globalThis.fetch;
		globalThis.fetch = async (input) =>
			origin(typeof input === 'string' ? input : input.url);
		try {
			return await worker.fetch(
				new Request(`https://uppy.io${path}`, {
					headers: accept ? { accept } : {},
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

	test('a missing twin falls back to html rather than 404ing', async () => {
		const res = await call('/examples/', 'text/markdown');
		assert.equal(res.status, 404); // origin's status, not a negotiation failure
		assert.match(res.headers.get('content-type'), /text\/html/);
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
