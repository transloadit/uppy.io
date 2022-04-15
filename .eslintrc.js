module.exports = {
  extends: ["plugin:mdx/recommended", "prettier"],
  plugins: ["markdown"],
  settings: {
    "mdx/code-blocks": true,
    // optional, if you want to disable language mapper, set it to `false`
    // if you want to override the default language mapper inside, you can provide your own
    "mdx/language-mapper": {},
  },
};
