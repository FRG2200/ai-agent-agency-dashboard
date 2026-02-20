/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'neo-dark': '#0A0E27',
        'neo-blue': '#0066FF',
        'neo-cyan': '#00D9FF',
        'neo-gold': '#FFD700',
        'neo-card': '#1A1F3A',
      },
    },
  },
  plugins: [],
}
