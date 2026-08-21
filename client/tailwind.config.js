/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        medicare: {
          50: '#f1f8f6',
          100: '#dcefe9',
          200: '#b8ded5',
          300: '#83c4b8',
          400: '#4aa497',
          500: '#0f6b68',
          600: '#0b5755',
          700: '#084744',
          800: '#173b3f',
          900: '#102a2c',
          950: '#0b2022',
        },
        brand: {
          cyan: '#4aa497',
          sky: '#0f6b68',
          blue: '#2f6974',
          emerald: '#3d8b72',
          dark: '#0d2527',
          cardDark: '#102a2c',
          borderDark: '#294543',
        },
      },
      fontFamily: {
        sans: ['IBM Plex Sans', 'sans-serif'],
        display: ['Literata', 'Georgia', 'serif'],
      },
      boxShadow: {
        'glow': '0 0 25px -5px rgba(14, 165, 233, 0.3)',
        'glow-emerald': '0 0 25px -5px rgba(16, 185, 129, 0.3)',
        'glow-red': '0 0 25px -5px rgba(239, 68, 68, 0.35)',
      },
    },
  },
  plugins: [],
}
