/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#E6C97A',
          dark: '#D5B861',
          soft: '#F5E8C7',
        },
        accent: {
          DEFAULT: '#121212',
          dark: '#0A0A0A',
          soft: '#2A2A2A',
        },
      },
      fontFamily: {
        display: ['"Bodoni Moda"', 'serif'],
        body: ['"Sora"', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 20px 60px -30px rgba(15, 23, 42, 0.35)',
      },
    },
  },
  plugins: [],
}

