// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const { themes } = require('prism-react-renderer');
const lightCodeTheme = themes.github;

/** @type {import('@docusaurus/types').Config} */
const config = {
	title: 'Uppy',
	tagline: 'Sleek, modular open source JavaScript file uploader',
	url: 'https://uppy.io',
	baseUrl: '/',
	onBrokenLinks: 'warn',
	onBrokenMarkdownLinks: 'warn',
	favicon: 'img/logo.svg',
	organizationName: 'transloadit', // Usually your GitHub org/user name.
	projectName: 'uppy.io', // Usually your repo name.
	trailingSlash: true,
	markdown: {
		format: 'detect',
	},
	presets: [
		[
			'classic',
			/** @type {import('@docusaurus/preset-classic').Options} */
			({
				docs: {
					breadcrumbs: false,
					sidebarPath: require.resolve('./sidebars.js'),
					editUrl: 'https://github.com/transloadit/uppy.io/tree/main',
				},
				blog: {
					showReadingTime: true,
					editUrl: 'https://github.com/transloadit/uppy.io/tree/main/',
				},
				theme: {
					customCss: require.resolve('./src/css/custom.css'),
				},
			}),
		],
	],
	plugins: [
		[
			'@docusaurus/plugin-client-redirects',
			{
				redirects: [
					{
						to: '/docs/guides/migration-guides',
						from: ['/docs/migration-guides.html'],
					},
					{
						to: '/docs/react',
						from: [
							'/docs/react/status-bar',
							'/docs/react/drag-drop',
							'/docs/react/file-input',
							'/docs/react/progress-bar',
							'/docs/react/dashboard',
							'/docs/react/dashboard-modal',
						],
					},
					{
						to: '/examples',
						from: [
							'/examples/dashboard',
							'/examples/dragdrop',
							'/examples/xhrupload',
							'/examples/i18n',
							'/examples/statusbar',
							'/examples/markdown-snippets',
							'/examples/transloadit',
						],
					},
					{ to: '/docs/status-bar', from: '/docs/statusbar' },
					{ to: '/docs/xhr-upload', from: '/docs/xhrupload' },
					{ to: '/docs/transloadit', from: '/docs/robodog' },
					{ to: '/docs/quick-start', from: '/docs/' },
					{
						to: '/docs/guides/building-plugins',
						from: '/docs/writing-plugins',
					},
				],
			},
		],
		'./src/plugins/custom.js',
	],
	scripts: [
		{
			src: 'https://plausible.io/js/script.js',
			async: true,
			defer: true,
			'data-domain': 'uppy.io',
		},
		{ src: 'https://buttons.github.io/buttons.js', async: true, defer: true },
	],

	themeConfig:
		/** @type {import('@docusaurus/preset-classic').ThemeConfig} */
		({
			image: 'img/og_image.jpg',
			metadata: [
				{ property: 'og:type', content: 'website' },
				{ property: 'og:title', content: 'Uppy' },
				{
					property: 'og:description',
					content: 'Sleek, modular open source JavaScript file uploader',
				},
				{ name: 'twitter:card', content: 'summary_large_image' },
				{ name: 'twitter:domain', content: 'uppy.io' },
				{ name: 'twitter:title', content: 'Uppy' },
				{
					name: 'twitter:description',
					content: 'Sleek, modular open source JavaScript file uploader',
				},
			],
			docs: { sidebar: { autoCollapseCategories: true } },
			colorMode: { disableSwitch: true },
			navbar: {
				title: 'Uppy',
				logo: {
					alt: 'Uppy Logo',
					src: 'img/logo.svg',
				},
				items: [
					{
						type: 'doc',
						docId: 'quick-start',
						position: 'left',
						label: 'Docs',
					},
					{ to: '/examples', label: 'Examples', position: 'left' },
					{ to: '/blog', label: 'Blog', position: 'left' },
					{
						href: 'https://github.com/transloadit/uppy',
						label: 'GitHub',
						position: 'left',
					},
					{
						href: 'https://community.transloadit.com/',
						label: 'Forum',
						position: 'left',
					},
					{
						href: 'https://transloadit.com/open-source/support/',
						label: 'Support',
						position: 'left',
					},
				],
			},
			algolia: {
				// The application ID provided by Algolia
				appId: 'Q65IKQHNN5',
				// Public API key: it is safe to commit it
				apiKey: '8a30cf604c46f44f2973f55ed6411586',
				indexName: 'uppy',
			},
			prism: {
				theme: lightCodeTheme,
			},
		}),
};

module.exports = config;
