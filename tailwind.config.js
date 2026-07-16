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
          DEFAULT: '#000000',
          light: '#0A0A0A',
          dark: '#000000',
        },
        secondary: {
          DEFAULT: '#C5A059', // Logo Brushed Gold
          light: '#E2C792',   // Shiny gold highlights
          dark: '#9A7B3E',    // Shadow gold tones
        },
        accent: {
          DEFAULT: '#FFFFFF',
          muted: '#A3A3A3',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      },
      animation: {
        'pulse-slow': 'pulse-slow 8s ease-in-out infinite',
        'float-slow': 'float-slow 12s ease-in-out infinite',
        'spin-orbit': 'spin-orbit 25s linear infinite',
        'spin-reverse': 'spin-reverse 25s linear infinite',
      },
      keyframes: {
        'pulse-slow': {
          '0%, 100%': {
            transform: 'scale(1) translate(0px, 0px)',
            opacity: '0.3',
          },
          '50%': {
            transform: 'scale(1.15) translate(20px, -20px)',
            opacity: '0.65',
          },
        },
        'float-slow': {
          '0%, 100%': {
            transform: 'translate(0px, 0px) scale(1)',
            opacity: '0.4',
          },
          '50%': {
            transform: 'translate(-30px, 35px) scale(1.1)',
            opacity: '0.7',
          },
        },
        'spin-orbit': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        'spin-reverse': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(-360deg)' },
        },
      },
    },
  },
  plugins: [],
}
