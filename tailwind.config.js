/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Arial', 'Roboto', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        base: '24px',
      },
      minHeight: {
        'button': '80px',
      },
    },
  },
  plugins: [],
}

