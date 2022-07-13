module.exports = {
  // That doesn't work, so leaving it disabled for now.
  // extends: ["plugin:mdx/recommended"],
  parserOptions: {
    sourceType: "module",
    ecmaVersion: 2022,
  },
  env: {
    node: false,
  },
  plugins: ["markdown"],
  settings: {
    "mdx/code-blocks": true,
    // optional, if you want to disable language mapper, set it to `false`
    // if you want to override the default language mapper inside, you can provide your own
    "mdx/language-mapper": {},
  },
  overrides: [
    {
      files: ["./*.js"],
      parserOptions: {
        sourceType: "script",
      },
      env: {
        node: true,
      },
    },
    {
      files: ["**/*.md", "*.md"],
      processor: "markdown/markdown",
    },
    {
      files: ["**/*.md/*.js", "**/*.md/*.javascript"],
      env: {
        node: false,
        browser: true,
      },
    },
    {
      files: ["**/*.md/*.jsx"],
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
  ],
};
