/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      fontFamily: {
        'montserrat-regular': ['Montserrat-Regular', 'sans-serif'],
        'montserrat-medium': ['Montserrat-Medium', 'sans-serif'],
        'montserrat-semi-bold': ['Montserrat-SemiBold', 'sans-serif'],
        'montserrat-bold': ['Montserrat-Bold', 'sans-serif'],
        'montserrat-extra-bold': ['Montserrat-ExtraBold', 'sans-serif'],
        'montserrat-thin': ['Montserrat-Thin', 'sans-serif'],
        'montserrat-light': ['Montserrat-Light', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#FC7D47',
          light: '#FF9B65',
          dark: '#E86A36',
          muted: '#FC7D471A',
        },
        secondary: '#3BA3A4',
        gray: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        },
      },
      spacing: {
        'vh-1': '0.0926vh',
        'vw-1': '0.0521vw',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideOut: {
          '0%': { transform: 'translateX(0)', opacity: '1' },
          '100%': { transform: 'translateX(100%)', opacity: '0' },
        },
        pulse: {
          '0%': { transform: 'translate(-50%, -50%) scale(1)', boxShadow: '0 0 0 0 rgba(212, 170, 248, 0.4)' },
          '70%': { transform: 'translate(-50%, -50%) scale(1.1)', boxShadow: '0 0 0 10px rgba(212, 170, 248, 0)' },
          '100%': { transform: 'translate(-50%, -50%) scale(1)', boxShadow: '0 0 0 0 rgba(212, 170, 248, 0)' },
        },
        spin: {
          'to': { transform: 'rotate(360deg)' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.3s ease',
        slideIn: 'slideIn 0.3s ease-out',
        slideOut: 'slideOut 0.3s ease-in',
        pulse: 'pulse 1.5s infinite',
        spin: 'spin 0.7s linear infinite',
      },
    },
  },
  plugins: [],
}
