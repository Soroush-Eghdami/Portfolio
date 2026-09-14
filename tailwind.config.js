/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  // Project card gradients come from the API (DB) at runtime, so Tailwind
  // can't see those class names while scanning source — safelist them.
  safelist: [
    {
      pattern: /^(from|to)-(violet|fuchsia|pink|indigo|cyan|blue|teal|emerald|amber|orange|red)-(400|500|600|700)$/,
    },
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Hanken Grotesk', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Hanken Grotesk', 'Space Grotesk', 'system-ui', 'sans-serif'],
      },
      colors: {
        ink: '#0E100F',
        inksoft: '#1A1C1A',
        cream: '#F7F2EA',
        creamdim: '#E9DFCB',
        paper: '#F7F2EA',
        aqua: '#4BC7D1',
        aquadeep: '#2FA8B4',
        accentv: '#8B7CFF',
        accentc: '#5EEAD4',
        accenty: '#FACC15',
      },
    },
  },
  plugins: [],
}
