/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0d0d0d',
        surface: '#1a1a1a',
        primary: '#8B0000',
        primaryHover: '#c0392b',
        secondary: '#b8860b',
        textLight: '#e8e8e8',
        textMuted: '#aaaaaa',
        borderDark: '#2a2a2a',
        success: '#2d6a2d',
        error: '#e74c3c'
      },
      fontFamily: {
        heading: ['Bebas Neue', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
