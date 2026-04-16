/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sage: {
          50:  '#f4f7f4',
          100: '#e8f0e8',
          200: '#c9dcc9',
          300: '#9dbf9d',
          400: '#6d9e6d',
          500: '#4a7c4a',
          600: '#3a6b3a',
          700: '#2e552e',
          800: '#264426',
          900: '#1e361e',
        },
        blush: {
          50:  '#fdf4f6',
          100: '#fce8ed',
          200: '#f9d0da',
          300: '#f4a8bc',
          400: '#ed7a9a',
          500: '#e2507a',
          600: '#cc3060',
          700: '#ab2450',
          800: '#8e2045',
          900: '#781e3d',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
