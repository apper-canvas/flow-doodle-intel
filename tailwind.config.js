/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FF6B6B',
        secondary: '#4ECDC4',
        accent: '#FFE66D',
        surface: '#2A2D3A',
        background: '#1F2128',
        success: '#95E1D3',
        warning: '#F6B93B',
        error: '#EE5A6F',
        info: '#686DE0'
      },
      fontFamily: {
        display: ['Fredoka One', 'cursive'],
        sans: ['Plus Jakarta Sans', 'ui-sans-serif', 'system-ui'],
        heading: ['Fredoka One', 'cursive']
      },
      animation: {
        'bounce-gentle': 'bounce 1s infinite',
        'pulse-slow': 'pulse 2s infinite',
        'shake': 'shake 0.5s ease-in-out',
        'coin-burst': 'coinBurst 0.6s ease-out'
      },
      keyframes: {
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-2px)' },
          '20%, 40%, 60%, 80%': { transform: 'translateX(2px)' }
        },
        coinBurst: {
          '0%': { transform: 'scale(0.8) rotate(0deg)', opacity: '0' },
          '50%': { transform: 'scale(1.2) rotate(180deg)', opacity: '1' },
          '100%': { transform: 'scale(1) rotate(360deg)', opacity: '1' }
        }
      }
    },
  },
  plugins: [],
}