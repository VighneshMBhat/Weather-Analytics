/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          'SF Pro Display',
          'SF Pro Text',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
      },
      colors: {
        // Vibrant gradient-based palette
        primary: '#6C63FF',
        secondary: '#00D4FF',
        accent: '#FF6B6B',
        highlight: '#FFD93D',
        success: '#00FFA3',
        danger: '#FF6B6B',
        warning: '#FFD93D',
        // Background colors
        'bg-light': '#F8FAFC',
        'bg-dark': '#0F172A',
        // Surface colors with opacity
        'surface-light': 'rgba(255, 255, 255, 0.6)',
        'surface-dark': 'rgba(17, 25, 40, 0.65)',
        // Glass effect backgrounds
        'glass-light': 'rgba(255, 255, 255, 0.25)',
        'glass-dark': 'rgba(15, 23, 42, 0.25)',
      },
      backgroundImage: {
        'gradient-1': 'linear-gradient(135deg, #6C63FF 0%, #00D4FF 100%)',
        'gradient-2': 'linear-gradient(135deg, #FF6B6B 0%, #FFD93D 100%)',
        'gradient-3': 'linear-gradient(135deg, #00FFA3 0%, #DC1FFF 100%)',
        'gradient-sunny': 'linear-gradient(135deg, #FFD93D 0%, #FF9F1C 100%)',
        'gradient-rainy': 'linear-gradient(135deg, #00D4FF 0%, #0077B6 100%)',
        'gradient-cloudy': 'linear-gradient(135deg, #6C63FF 0%, #BDB2FF 100%)',
        'gradient-stormy': 'linear-gradient(135deg, #0F172A 0%, #6C63FF 100%)',
        'gradient-night': 'linear-gradient(135deg, #1E1E2E 0%, #3A0CA3 100%)',
        'gradient-snowy': 'linear-gradient(135deg, #E0F7FA 0%, #B2EBF2 100%)',
        'gradient-animated': 'linear-gradient(270deg, #6C63FF, #00D4FF, #00FFA3, #FFD93D)',
        'gradient-aurora': 'linear-gradient(135deg, #6C63FF, #00D4FF, #00FFA3)',
      },
      backdropBlur: {
        xs: '2px',
        sm: '8px',
        md: '16px',
        lg: '24px',
        xl: '40px',
      },
      boxShadow: {
        soft: '0 8px 32px rgba(0, 0, 0, 0.15)',
        'soft-lg': '0 10px 40px rgba(0, 0, 0, 0.2)',
        glow: '0 0 40px rgba(108, 99, 255, 0.6), 0 0 80px rgba(0, 212, 255, 0.4)',
        'glow-lg': '0 0 60px rgba(108, 99, 255, 0.8), 0 0 100px rgba(0, 212, 255, 0.6)',
        'glow-cyan': '0 0 25px rgba(0, 212, 255, 0.4)',
        'glow-coral': '0 0 25px rgba(255, 107, 107, 0.4)',
        'inner-soft': 'inset 0 2px 4px rgba(0, 0, 0, 0.06)',
        glass: '0 8px 32px 0 rgba(108, 99, 255, 0.15)',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-in-out',
        'fade-in-slow': 'fadeIn 0.8s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'slide-down': 'slideDown 0.4s ease-out',
        'slide-left': 'slideLeft 0.4s ease-out',
        'slide-right': 'slideRight 0.4s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'spin-slow': 'spin 8s linear infinite',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'float': 'float 3s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite',
        'gradient-shift': 'gradientShift 15s ease infinite',
        'aurora': 'aurora 20s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideLeft: {
          '0%': { transform: 'translateX(20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideRight: {
          '0%': { transform: 'translateX(-20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(108, 99, 255, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(108, 99, 255, 0.6)' },
        },
        gradientShift: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        aurora: {
          '0%': { backgroundPosition: '0% 50%', backgroundSize: '200% 200%' },
          '50%': { backgroundPosition: '100% 50%', backgroundSize: '250% 250%' },
          '100%': { backgroundPosition: '0% 50%', backgroundSize: '200% 200%' },
        },
      },
      transitionDuration: {
        '400': '400ms',
      },
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
  },
  plugins: [],
};
