/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Hanken Grotesk', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Hanken Grotesk', 'Space Grotesk', 'system-ui', 'sans-serif'],
      },
      colors: {
        ink: '#0E100F',
        inksoft: '#1A1C1A',
        cream: '#FFFCE1',
        creamdim: '#D6D3C0',
        accentv: '#8B7CFF',
        accentc: '#5EEAD4',
        accenty: '#FACC15',
      },
    },
  },
  plugins: [],
}
