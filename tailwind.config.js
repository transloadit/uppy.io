/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["src/**/*.{js,jsx,ts,tsx}", "docs/**/*.mdx"],
  theme: {
    extend: {
      fontFamily: {
        sans: 'IBM Plex Sans',
        serif: 'IBM Plex Serif'
      },
      colors: {
        uppy: '#f37'
      }
    },
  },
  plugins: [],
}
