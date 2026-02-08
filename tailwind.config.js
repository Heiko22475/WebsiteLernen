/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: 'var(--color-brand)',
          dark: 'var(--color-brand-dark)',
          soft: 'var(--color-brand-soft)',
        },
        accent: {
          DEFAULT: 'var(--color-accent)',
          dark: 'var(--color-accent-dark)',
          soft: 'var(--color-accent-soft)',
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

