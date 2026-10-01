/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f3f6fa',
          100: '#e5ecf5',
          200: '#c5d5e9',
          300: '#95b3d7',
          400: '#5e8cc1',
          500: '#395082', // Signature slate/indigo blue
          600: '#2f436e',
          700: '#253557',
          800: '#1d2a45',
          900: '#111827', // Deep charcoal
          accent: '#ff7e00', // Campus vibrant orange
          accentHover: '#e57100',
          green: '#1b9e4b', // Escrow verified green
          greenHover: '#16863f',
        },
      },
      fontFamily: {
        sans: ['Manrope', 'Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.03)',
        'card-hover': '0 12px 24px -10px rgba(57, 80, 130, 0.12), 0 4px 8px -2px rgba(0,0,0,0.04)',
        'dropdown': '0 10px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.04)',
      },
    },
  },
  plugins: [],
}
