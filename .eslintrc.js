module.exports = {
	parserOptions: {
		sourceType: 'module',
		ecmaVersion: 2022,
	},
	env: { node: false },
	plugins: ['@docusaurus', 'markdown', 'mdx'],
	extends: ['plugin:@docusaurus/recommended'],
	overrides: [
		{
			files: ['./*.js'],
			parserOptions: {
				sourceType: 'script',
			},
			env: {
				node: true,
			},
		},
		{
			files: ['**/*.md', '*.md'],
			processor: 'markdown/markdown',
		},
		{
			files: ['**/*.mdx', '*.mdx'],
			extends: 'plugin:mdx/recommended',
		},
		{
			files: ['**/*.md/*.js', '**/*.mdx/*.js'],
			env: {
				node: false,
				browser: true,
			},
		},
		{
			files: ['**/*.md/*.jsx', '**/*.mdx/*.jsx'],
			parserOptions: {
				ecmaFeatures: {
					jsx: true,
				},
			},
		},
	],
};
