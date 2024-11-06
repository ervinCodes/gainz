const defaultTheme = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      xs: "180px",
      ...defaultTheme.screens,
    },
    extend: {
      colors: {
        'space-cadet': '#262A56',
        'alloy-orange': '#fca311',
        'dun': '#E3CCAE'
      },
      fontFamily: {
        oxygen: ['Oxygen', 'sans-serif']
      },
      backgroundImage: {
        'hero': "url('../public/images/dumbbells.jpg')"
      }
    },
  },
  plugins: [],
}
