const fs = require('node:fs/promises');
const path = require('node:path');

const DOCS_DIR = 'docs';
const ROUTE_BASE = '/docs';

// ponytail: hand-rolled scalar-only frontmatter reader. We only ever read
// `title`, `description` and `slug`, all plain strings. Swap in `gray-matter`
// if a doc ever needs nested or multi-line frontmatter.
function splitFrontmatter(raw) {
	const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/.exec(raw);
	if (!match) return { data: {}, body: raw };

	const data = {};
	for (const line of match[1].split(/\r?\n/)) {
		const kv = /^([A-Za-z0-9_-]+):\s*(.*)$/.exec(line);
		if (!kv) continue;
		data[kv[1]] = kv[2].trim().replace(/^['"]|['"]$/g, '');
	}
	return { data, body: raw.slice(match[0].length) };
}

async function walk(dir) {
	const out = [];
	for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
		const full = path.join(dir, entry.name);
		if (entry.isDirectory()) out.push(...(await walk(full)));
		else if (/\.mdx?$/.test(entry.name)) out.push(full);
	}
	return out;
}

// Mirrors Docusaurus' own id -> route rules: path relative to the docs root,
// extension dropped, a trailing `index`/`README` collapsing to its folder, and
// an explicit frontmatter `slug` winning over all of it.
function routeFor(relPath, slug) {
	if (slug) {
		return slug.startsWith('/') ?
				path.posix.join(ROUTE_BASE, slug)
			:	path.posix.join(ROUTE_BASE, path.posix.dirname(relPath), slug);
	}
	const id = relPath
		.replace(/\.mdx?$/, '')
		.replace(/(^|\/)(index|README)$/i, '');
	return path.posix.join(ROUTE_BASE, id);
}

// MDX pages open with a preamble of `import`/`export` statements for their JSX
// components. That is build machinery, not documentation, so it is stripped
// from the Markdown we publish. Only the leading run is removed: an `import`
// further down the page is almost certainly inside a fenced code example, and
// stripping that would corrupt the docs.
function stripMdxPreamble(body) {
	const statement =
		/^\s*(?:import|export)\s(?:[^\n]*?;\s*$|[\s\S]*?^\s*\}?\s*from\s[^\n]*$|[^\n]*$)/m;

	let rest = body.replace(/^\s+/, '');
	for (;;) {
		const match = statement.exec(rest);
		if (!match || match.index !== 0) break;
		rest = rest.slice(match[0].length).replace(/^\s+/, '');
	}
	return rest.trim();
}

function firstParagraph(body) {
	for (const block of body.split(/\r?\n\r?\n/)) {
		const text = block.trim();
		if (!text || text.startsWith('#') || text.startsWith(':::')) continue;
		if (text.startsWith('import ') || text.startsWith('export ')) continue;
		const flat = text.replace(/\s+/g, ' ');
		if (flat.length <= 200) return flat;
		return `${flat.slice(0, flat.lastIndexOf(' ', 200))}…`;
	}
	return '';
}

// An OpenAPI description of the documentation *content* API: the pages, their
// Markdown twins, and the machine-readable indexes. Generated from the same
// page list as llms.txt so the two can never disagree. This describes what
// uppy.io actually serves -- every response here is reproducible with curl.
function buildOpenApi(siteConfig, site, pages) {
	const slugs = pages
		.map((p) => p.route.replace(/^\/docs\/?/, ''))
		.filter(Boolean);

	const notFound = {
		description:
			'No such page. The body lists the documentation index, the sitemap and llms.txt so a client can recover.',
		content: { 'text/html': { schema: { type: 'string' } } },
	};

	const plainText = (description) => ({
		description,
		content: { 'text/plain': { schema: { type: 'string' } } },
	});

	return {
		openapi: '3.1.0',
		info: {
			title: `${siteConfig.title} documentation content API`,
			summary: 'Read-only HTTP access to the Uppy documentation.',
			description: [
				'uppy.io serves its documentation as static files. Every page is',
				'available as HTML and as Markdown (append `.md` to the path), and',
				'the whole corpus is indexed by llms.txt.',
				'',
				'This is a content API, not a service API: every operation is a GET,',
				'nothing is authenticated, and nothing has side effects. The Uppy',
				'*server* component is Companion, which is documented separately at',
				`${site}/docs/companion.`,
			].join('\n'),
			version: '1.0.0',
			license: { name: 'MIT', identifier: 'MIT' },
		},
		servers: [{ url: site }],
		tags: [
			{
				name: 'pages',
				description: 'Documentation pages, as HTML or Markdown.',
			},
			{ name: 'indexes', description: 'Machine-readable indexes of the site.' },
		],
		paths: {
			'/docs/{slug}': {
				get: {
					tags: ['pages'],
					operationId: 'getDocPage',
					summary: 'Fetch a documentation page as HTML.',
					parameters: [
						{
							name: 'slug',
							in: 'path',
							required: true,
							// Some slugs contain a slash (e.g. guides/browser-support), so
							// the valid values are enumerated rather than pattern-matched.
							description: 'Page identifier. Some slugs contain a slash.',
							schema: { type: 'string', enum: slugs },
						},
					],
					responses: {
						200: {
							description: 'The rendered page.',
							content: { 'text/html': { schema: { type: 'string' } } },
						},
						404: notFound,
					},
				},
			},
			'/docs/{slug}.md': {
				get: {
					tags: ['pages'],
					operationId: 'getDocPageMarkdown',
					summary: 'Fetch the same page as Markdown.',
					description:
						'Preferred for agents: the Markdown is the documentation source, without site chrome.',
					parameters: [
						{
							name: 'slug',
							in: 'path',
							required: true,
							description: 'Page identifier. Some slugs contain a slash.',
							schema: { type: 'string', enum: slugs },
						},
					],
					responses: {
						200: {
							description: 'The page source.',
							content: { 'text/markdown': { schema: { type: 'string' } } },
						},
						404: notFound,
					},
				},
			},
			'/llms.txt': {
				get: {
					tags: ['indexes'],
					operationId: 'getLlmsIndex',
					summary: 'Index of the documentation, in llmstxt.org format.',
					responses: {
						200: plainText(
							`An llmstxt.org index linking every page's Markdown twin.`,
						),
					},
				},
			},
			'/llms-full.txt': {
				get: {
					tags: ['indexes'],
					operationId: 'getLlmsFull',
					summary: 'The entire documentation as one Markdown file.',
					responses: {
						200: plainText('Every documentation page, concatenated.'),
					},
				},
			},
			'/sitemap.xml': {
				get: {
					tags: ['indexes'],
					operationId: 'getSitemap',
					summary: 'Every URL on this site.',
					responses: {
						200: {
							description: 'A urlset sitemap.',
							content: { 'application/xml': { schema: { type: 'string' } } },
						},
					},
				},
			},
			'/robots.txt': {
				get: {
					tags: ['indexes'],
					operationId: 'getRobots',
					summary: 'Crawler policy, pointing at the sitemap.',
					responses: { 200: plainText('A robots.txt naming the sitemap.') },
				},
			},
		},
	};
}

module.exports = function agentReadiness(context) {
	const { siteDir, siteConfig } = context;
	const site = siteConfig.url.replace(/\/$/, '');

	return {
		name: 'agent-readiness',

		async postBuild({ outDir }) {
			const docsRoot = path.join(siteDir, DOCS_DIR);
			const files = (await walk(docsRoot)).sort();

			const pages = [];
			const skipped = [];

			for (const file of files) {
				const relPath = path.relative(docsRoot, file).split(path.sep).join('/');
				const raw = await fs.readFile(file, 'utf8');
				const { data, body } = splitFrontmatter(raw);
				const route = routeFor(relPath, data.slug);

				// The built HTML is the source of truth for which routes exist. If a
				// doc did not produce one, our route guess is wrong -- say so loudly
				// rather than publishing a link that 404s.
				const builtHtml = path.join(
					outDir,
					route.replace(/^\//, ''),
					'index.html',
				);
				try {
					await fs.access(builtHtml);
				} catch {
					skipped.push(relPath);
					continue;
				}

				const title =
					data.title ||
					(/^#\s+(.+)$/m.exec(body)?.[1] ?? '').trim() ||
					path.basename(relPath, path.extname(relPath));

				pages.push({
					route,
					title,
					description: data.description || firstParagraph(body),
					body: stripMdxPreamble(body),
				});
			}

			// Quick start is the entry point agents should read first; everything
			// else reads better alphabetically than in file-path order.
			pages.sort((a, b) => {
				const rank = (p) => (p.route === '/docs/quick-start' ? 0 : 1);
				return rank(a) - rank(b) || a.title.localeCompare(b.title);
			});

			// `.md` twin next to each built page, so an agent can fetch the Markdown
			// source by URL even where the host cannot content-negotiate.
			for (const page of pages) {
				const target = path.join(outDir, `${page.route.replace(/^\//, '')}.md`);
				await fs.mkdir(path.dirname(target), { recursive: true });
				await fs.writeFile(
					target,
					// Docs that already open with an H1 keep theirs; the rest get one
					// so every twin has a title.
					page.body.startsWith('# ') ?
						`${page.body}\n\nSource: ${site}${page.route}\n`
					:	`# ${page.title}\n\nSource: ${site}${page.route}\n\n${page.body}\n`,
				);
			}

			const index = [
				`# ${siteConfig.title}`,
				'',
				`> ${siteConfig.tagline}`,
				'',
				'Uppy is an open source JavaScript file uploader for the browser. It',
				'uploads from disk and from remote sources such as Google Drive, Dropbox',
				'and OneDrive, resumes interrupted uploads over the tus protocol, and has',
				'official bindings for React, Vue, Svelte and Angular.',
				'',
				'Every page below is also available as Markdown at the same URL with a',
				'`.md` suffix.',
				'',
				'## Documentation',
				'',
				...pages.map(
					(p) =>
						`- [${p.title}](${site}${p.route}.md)${p.description ? `: ${p.description}` : ''}`,
				),
				'',
				'## Optional',
				'',
				`- [Examples](${site}/examples): Live, runnable Uppy demos.`,
				`- [Blog](${site}/blog): Release notes and announcements.`,
				`- [Sitemap](${site}/sitemap.xml): Every URL on this site.`,
				`- [Source](https://github.com/transloadit/uppy): The Uppy monorepo on GitHub.`,
				'',
			].join('\n');

			const full = [
				`# ${siteConfig.title} — full documentation`,
				'',
				`> ${siteConfig.tagline}`,
				'',
				...pages.flatMap((p) => [
					'---',
					'',
					`Source: ${site}${p.route}`,
					'',
					p.body.startsWith('# ') ? p.body : `# ${p.title}\n\n${p.body}`,
					'',
				]),
			].join('\n');

			await fs.writeFile(path.join(outDir, 'llms.txt'), index);
			await fs.writeFile(path.join(outDir, 'llms-full.txt'), full);
			await fs.writeFile(
				path.join(outDir, 'openapi.json'),
				`${JSON.stringify(buildOpenApi(siteConfig, site, pages), null, 2)}\n`,
			);

			console.log(
				`[agent-readiness] ${pages.length} pages -> llms.txt, llms-full.txt, openapi.json, .md twins`,
			);
			if (skipped.length) {
				console.warn(
					`[agent-readiness] no built route for: ${skipped.join(', ')}`,
				);
			}
		},
	};
};
