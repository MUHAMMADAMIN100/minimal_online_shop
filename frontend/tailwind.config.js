/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          50: '#f5f5f7',
          100: '#e5e5ea',
          200: '#c7c7cc',
          500: '#1a1a1a',
          600: '#0f0f0f',
          900: '#000000',
        },
        accent: {
          500: '#c2a878',
          600: '#a98b57',
        },
      },
      boxShadow: {
        card: '0 4px 20px -6px rgba(0,0,0,0.08)',
        cardHover: '0 12px 40px -10px rgba(0,0,0,0.18)',
      },
    },
  },
  plugins: [],
};
