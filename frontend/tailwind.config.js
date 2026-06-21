/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      "colors": {
          "background": "#f7f9fb",
          "primary": "#00236f",
          "surface-container": "#eceef0",
          "surface-container-low": "#f2f4f6",
          "surface-canvas": "#FFFFFF",
          "text-primary": "#0F172A",
          "text-secondary": "#475569",
          "outline": "#757682",
          "outline-variant": "#c5c5d3",
          "vibrant-teal": "#009688",
          "vibrant-blue": "#03a9f4",
          "vibrant-purple": "#673ab7",
          "vibrant-orange": "#ff5722",
          "brand-teal": "#00a19a",
          "brand-purple": "#7e22ce",
          "brand-orange": "#fd761a",
          "brand-blue": "#2563eb"
      },
      "fontFamily": {
          "display-lg": ["Montserrat", "sans-serif"],
          "title-md": ["Montserrat", "sans-serif"],
          "body-md": ["Roboto Flex", "sans-serif"],
          "body-lg": ["Roboto Flex", "sans-serif"]
      }
    },
  },
  plugins: [],
}
