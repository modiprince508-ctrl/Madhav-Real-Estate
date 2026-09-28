/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Outfit', 'sans-serif'],
      },
      colors: {
        brand: {
          50: '#faf9f6', // Warm off-white
          100: '#f0ece1', // Subtle beige
          500: '#c5a059', // Muted Gold/Bronze accent
          600: '#a8884a', // Darker Bronze for hover
          900: '#121212', // Charcoal/Deep Black
        }
      }
    },
  },
  plugins: [],
}
