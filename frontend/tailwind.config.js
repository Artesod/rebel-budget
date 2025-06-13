/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        secondary: {
          50: '#fef7f0',
          100: '#feecdc',
          200: '#fcd9bd',
          300: '#fdba8c',
          400: '#ff8a4c',
          500: '#ff5a1f',
          600: '#d03801',
          700: '#b43403',
          800: '#8a2c0d',
          900: '#73230d',
        },
        'game-primary': '#6366F1',    // Indigo
        'game-secondary': '#10B981',  // Emerald
        'game-accent': '#F59E0B',     // Amber
        'game-danger': '#EF4444',     // Red
        'game-success': '#22C55E',    // Green
        'game-background': '#1F2937', // Dark gray
        'game-card': '#374151',       // Slightly lighter gray
        'p5-red': '#e60012',
        'p5-black': '#111111',
        'p5-white': '#fff',
        'p5-yellow': '#ffe600',
        'p5-gray': '#222',
        'p5-card': '#191919',
        'p5-shadow': '#ff003c',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        'comic': ['Bangers', 'Luckiest Guy', 'Anton', 'Arial Black', 'sans-serif'],
      },
      animation: {
        'bounce-slow': 'bounce 3s infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'p5-slide-in': 'p5-slide-in 0.7s cubic-bezier(0.68,-0.55,0.27,1.55) both',
        'p5-pop': 'p5-pop 0.4s cubic-bezier(0.68,-0.55,0.27,1.55)',
        'p5-shake': 'p5-shake 0.5s cubic-bezier(.36,.07,.19,.97) both',
        'p5-wiggle': 'p5-wiggle 0.7s infinite',
        'p5-swoosh': 'p5-swoosh 1s cubic-bezier(0.68,-0.55,0.27,1.55)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'p5-slide-in': {
          '0%': { transform: 'translateY(60px) scale(0.95)', opacity: '0' },
          '100%': { transform: 'translateY(0) scale(1)', opacity: '1' },
        },
        'p5-pop': {
          '0%': { transform: 'scale(0.7)' },
          '80%': { transform: 'scale(1.1)' },
          '100%': { transform: 'scale(1)' },
        },
        'p5-shake': {
          '10%, 90%': { transform: 'translateX(-2px)' },
          '20%, 80%': { transform: 'translateX(4px)' },
          '30%, 50%, 70%': { transform: 'translateX(-8px)' },
          '40%, 60%': { transform: 'translateX(8px)' },
        },
        'p5-wiggle': {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        'p5-swoosh': {
          '0%': { width: '0%' },
          '100%': { width: '100%' },
        },
      },
      boxShadow: {
        'game': '0 0 15px rgba(99, 102, 241, 0.5)',
        'game-hover': '0 0 20px rgba(99, 102, 241, 0.7)',
        'p5': '4px 4px 0 #ff003c, 8px 8px 0 #111',
        'p5-pop': '0 0 0 4px #fff, 0 0 0 8px #e60012',
      },
      borderWidth: {
        'comic': '4px',
      },
      borderRadius: {
        'comic': '1.5rem',
      },
      backgroundImage: {
        'halftone': "url(\"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='8' cy='8' r='2.5' fill='white' fill-opacity='0.08'/%3E%3Ccircle cx='32' cy='8' r='1.5' fill='white' fill-opacity='0.10'/%3E%3Ccircle cx='8' cy='32' r='1.5' fill='white' fill-opacity='0.10'/%3E%3Ccircle cx='32' cy='32' r='2.5' fill='white' fill-opacity='0.08'/%3E%3Ccircle cx='20' cy='20' r='3' fill='white' fill-opacity='0.12'/%3E%3Ccircle cx='20' cy='8' r='1' fill='white' fill-opacity='0.07'/%3E%3Ccircle cx='8' cy='20' r='1' fill='white' fill-opacity='0.07'/%3E%3Ccircle cx='32' cy='20' r='1' fill='white' fill-opacity='0.07'/%3E%3Ccircle cx='20' cy='32' r='1' fill='white' fill-opacity='0.07'/%3E%3C/svg%3E\")",
      },
    },
  },
  plugins: [],
} 