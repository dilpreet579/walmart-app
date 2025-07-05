/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'walmart-blue': '#0071DC',
        'walmart-yellow': '#FFC220'
      }
    },
  },
  plugins: [
    require('@tailwindcss/aspect-ratio'),
    // Remove @tailwindcss/line-clamp as it's included by default in v3.3+
  ],
}