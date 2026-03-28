/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        forge: {
          bg: '#0f0f13',
          surface: '#1a1a24',
          border: '#2a2a3a',
          accent: '#7c5cfc',
          'accent-hover': '#9478ff',
          text: '#e2e2f0',
          muted: '#8888a0',
          node: '#1e1e2e',
        },
      },
    },
  },
  plugins: [],
};
