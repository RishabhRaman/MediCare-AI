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
          dark: '#091617',
          cardDark: '#102629',
          borderDark: '#1c4246',
          canvasLight: '#fbfcfa',
          canvasSubtle: '#f3f7f5',
          borderLight: '#e2ebe7',
          ink: '#122b2e',
          inkMuted: '#4f6664',
        },
      },
      fontFamily: {
        sans: ['IBM Plex Sans', 'Inter', '-apple-system', 'sans-serif'],
        display: ['Literata', 'Georgia', 'serif'],
        heading: ['Plus Jakarta Sans', 'IBM Plex Sans', 'sans-serif'],
      },
      boxShadow: {
        'subtle': '0 1px 2px 0 rgba(18, 43, 46, 0.04), 0 1px 3px 0 rgba(18, 43, 46, 0.03)',
        'card': '0 1px 3px 0 rgba(18, 43, 46, 0.04), 0 6px 24px 0 rgba(18, 43, 46, 0.04)',
        'card-hover': '0 4px 6px -1px rgba(18, 43, 46, 0.05), 0 14px 32px -4px rgba(18, 43, 46, 0.08)',
        'elevation': '0 12px 36px -4px rgba(18, 43, 46, 0.1)',
        'glow': '0 0 25px -5px rgba(15, 107, 104, 0.25)',
        'glow-teal': '0 0 25px -5px rgba(74, 164, 151, 0.3)',
        'glow-emerald': '0 0 25px -5px rgba(61, 139, 114, 0.25)',
        'glow-red': '0 0 25px -5px rgba(220, 38, 38, 0.35)',
      },
    },
  },
  plugins: [],
}
