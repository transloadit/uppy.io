// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/vsDark');

/** @type {import('@docusaurus/types').Config} */
const config = {
	title: 'Uppy',
	tagline: 'Modular open source file uploader',
	url: 'https://uppy.io',
	baseUrl: '/',
	onBrokenLinks: 'warn',
	onBrokenMarkdownLinks: 'warn',
	favicon: 'img/logo.svg',
	organizationName: 'transloadit', // Usually your GitHub org/user name.
	projectName: 'uppy.io', // Usually your repo name.
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

	scripts: [
		{
			src: 'https://analytics.transloadit.com/js/plausible.js',
			async: true,
			defer: true,
			'data-domain': 'uppy.io',
		},
		{ src: 'https://buttons.github.io/buttons.js', async: true, defer: true },
	],

	themeConfig:
		/** @type {import('@docusaurus/preset-classic').ThemeConfig} */
		({
			docs: { sidebar: { autoCollapseCategories: true } },
			// colorMode: { disableSwitch: true },
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
			footer: {
				style: 'dark',
				links: [
					{
						title: 'Docs',
						items: [
							{
								label: 'Tutorial',
								to: '/docs/quick-start',
							},
						],
					},
					{
						title: 'Community',
						items: [
							{
								label: 'Stack Overflow',
								href: 'https://stackoverflow.com/questions/tagged/uppy',
							},
							{
								label: 'Twitter',
								href: 'https://twitter.com/uppy.io',
							},
						],
					},
					{
						title: 'More',
						items: [
							{
								label: 'Blog',
								to: '/blog',
							},
							{
								label: 'GitHub',
								href: 'https://github.com/transloadit/uppy',
							},
						],
					},
				],
				copyright: `Copyright © ${new Date().getFullYear()} Transloadit`,
			},
			prism: {
				theme: lightCodeTheme,
				darkTheme: darkCodeTheme,
			},
		}),
};

module.exports = config;
