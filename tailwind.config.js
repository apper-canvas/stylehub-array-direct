/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'display': ['DM Sans', 'sans-serif'],
        'body': ['Inter', 'sans-serif'],
      },
      colors: {
        primary: '#1a1a1a',
        secondary: '#4a4a4a',
        accent: '#ff6b6b',
        surface: '#ffffff',
        background: '#f8f8f8',
        success: '#51cf66',
        warning: '#ffd43b',
        error: '#ff6b6b',
        info: '#339af0',
      },
      transitionDuration: {
        '150': '150ms',
        '250': '250ms',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
    },
  },
  plugins: [],
}