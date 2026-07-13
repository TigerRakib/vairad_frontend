/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#5B5CEB',
          hover: '#4949D4',
          50: '#EEF0FF',
          100: '#D9DBFF',
          200: '#B3B7FF',
          300: '#8D93FF',
          400: '#6E74FF',
          500: '#5B5CEB',
          600: '#4949D4',
          700: '#3A3CB9',
          800: '#292B9E',
          900: '#181A83',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          bg: '#F7F8FC',
        },
        border: {
          DEFAULT: '#E7E9F2',
        },
        text: {
          primary: '#1F2937',
          secondary: '#6B7280',
        },
        success: '#22C55E',
        warning: '#F59E0B',
        danger: '#EF4444',
      },
      boxShadow: {
        card: '0 8px 24px rgba(0,0,0,0.08)',
        'card-hover': '0 12px 32px rgba(0,0,0,0.12)',
      },
      borderRadius: {
        card: '16px',
        button: '12px',
        input: '12px',
        modal: '20px',
      },
    },
  },
  plugins: [],
};
