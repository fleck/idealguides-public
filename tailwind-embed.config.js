const { tailwindId } = require("./app/tailwind-id.js")

/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ["./pages/api/embeds/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
  important: `#${tailwindId}`,
}
