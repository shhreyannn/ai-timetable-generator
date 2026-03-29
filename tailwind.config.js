/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1F3A5F',
          50: '#E8F0FE',
          100: '#D1E1FD',
          200: '#A3C3FB',
          300: '#75A5F9',
          400: '#4787F7',
          500: '#1F3A5F',
          600: '#1A3152',
          700: '#152845',
          800: '#101F38',
          900: '#0B162B',
        },
        secondary: {
          DEFAULT: '#E8F0FE',
          dark: '#C5D9F7',
        },
        accent: {
          DEFAULT: '#4CAF50',
          light: '#81C784',
          dark: '#388E3C',
        },
        warning: {
          DEFAULT: '#E53935',
          light: '#EF5350',
          dark: '#C62828',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          dark: '#0F172A',
          card: '#FFFFFF',
          'card-dark': '#1E293B',
        }
      },
      fontFamily: {
        heading: ['Poppins', 'Inter', 'sans-serif'],
        body: ['Open Sans', 'Inter', 'sans-serif'],
      },
      borderRadius: {
        'card': '1rem',
      },
      boxShadow: {
        'card': '0 4px 6px -1px rgba(31, 58, 95, 0.1), 0 2px 4px -2px rgba(31, 58, 95, 0.1)',
        'card-hover': '0 20px 25px -5px rgba(31, 58, 95, 0.1), 0 8px 10px -6px rgba(31, 58, 95, 0.1)',
        'glow': '0 0 20px rgba(76, 175, 80, 0.3)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
}
