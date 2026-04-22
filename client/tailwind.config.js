import tailwindcss from '@tailwindcss/vite'

/** @type {import('tailwindcss').Config} */
export default tailwindcss({
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fff5f5',
          100: '#fed7d7',
          500: '#ff6b6b',
          600: '#ff5252',
          700: '#ff3838',
        },
        secondary: {
          50: '#f8fafc',
          100: '#f1f5f9',
          500: '#1f2937',
          600: '#111827',
          700: '#030712',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Segoe UI', 'Tahoma', 'Geneva', 'Verdana', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 12px 32px rgba(15, 23, 42, 0.12)',
        'card-hover': '0 20px 40px rgba(15, 23, 42, 0.16)',
      }
    },
  },
})
