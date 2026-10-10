/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        neon: {
          purple: {
            DEFAULT: '#BB86FC',
            light: '#D0A9F5',
            dark: '#9A67EA',
            glow: 'rgba(187, 134, 252, 0.6)',
          },
          green: {
            DEFAULT: '#03DAC6',
            light: '#66E5D9',
            dark: '#00B8A9',
            glow: 'rgba(3, 218, 198, 0.6)',
          },
        },
        surface: {
          DEFAULT: '#121212',
          elevated: '#1E1E1E',
          card: '#1F1F1F',
        },
        background: {
          DEFAULT: '#0A0A0A',
          secondary: '#121212',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Space Grotesk', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'neon-purple': '0 0 20px rgba(187, 134, 252, 0.4), 0 0 40px rgba(187, 134, 252, 0.2)',
        'neon-green': '0 0 20px rgba(3, 218, 198, 0.4), 0 0 40px rgba(3, 218, 198, 0.2)',
        'neon-purple-lg': '0 0 30px rgba(187, 134, 252, 0.5), 0 0 60px rgba(187, 134, 252, 0.3)',
        'neon-green-lg': '0 0 30px rgba(3, 218, 198, 0.5), 0 0 60px rgba(3, 218, 198, 0.3)',
        'inner-neon-purple': 'inset 0 0 20px rgba(187, 134, 252, 0.2)',
        'inner-neon-green': 'inset 0 0 20px rgba(3, 218, 198, 0.2)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'neon-grid': 'linear-gradient(rgba(187, 134, 252, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(187, 134, 252, 0.03) 1px, transparent 1px)',
      },
      backgroundSize: {
        'grid': '40px 40px',
      },
      animation: {
        'pulse-neon': 'pulse-neon 2s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'slide-up': 'slide-up 0.5s ease-out',
        'slide-down': 'slide-down 0.3s ease-in',
        'scale-in': 'scale-in 0.2s ease-out',
        'shake': 'shake 0.5s ease-in-out',
      },
      keyframes: {
        'pulse-neon': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'glow': {
          '0%': { boxShadow: '0 0 20px rgba(187, 134, 252, 0.4)' },
          '100%': { boxShadow: '0 0 40px rgba(187, 134, 252, 0.6), 0 0 60px rgba(187, 134, 252, 0.3)' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'slide-down': {
          '0%': { transform: 'translateY(0)', opacity: '1' },
          '100%': { transform: 'translateY(20px)', opacity: '0' },
        },
        'scale-in': {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'shake': {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-5px)' },
          '75%': { transform: 'translateX(5px)' },
        },
      },
    },
  },
  plugins: [],
}