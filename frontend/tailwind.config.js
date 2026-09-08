/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#5B3FE0',
          dark: '#2A1665',
          light: '#EDE9FB',
        },
        ink: '#17181F',
        cashback: '#0F9D58',
      },
      backgroundImage: {
        'hero-gradient': 'radial-gradient(120% 100% at 100% 0%, #7A5CF0 0%, #4B2ACD 35%, #1E0F52 100%)',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
