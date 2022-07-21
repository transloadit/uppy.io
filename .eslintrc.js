module.exports = {
  parserOptions: {
    sourceType: "module",
    ecmaVersion: 2022,
  },
  env: { node: false },
  plugins: ["@docusaurus"],
  extends: ["plugin:@docusaurus/recommended"],
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
