
/** @type {import('tailwindcss').Config} */
export default {
  content: [
  './index.html',
  './src/**/*.{js,ts,jsx,tsx}'
],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: '#2563EB',
          purple: '#7C3AED',
          pink: '#EC4899',
          navy: '#0F172A',
          light: '#F8FAFC',
          'light-gray': '#F8FAFC',
          'mid-gray': '#E2E8F0',
        },
      },
      fontFamily: {
        heading: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
        arabic: ['"Noto Sans Arabic"', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-brand': 'linear-gradient(135deg, #2563EB 0%, #7C3AED 50%, #EC4899 100%)',
        'gradient-brand-hover': 'linear-gradient(135deg, #1D4ED8 0%, #6D28D9 50%, #DB2777 100%)',
        'gradient-brand-subtle': 'linear-gradient(135deg, rgba(37,99,235,0.08) 0%, rgba(124,58,237,0.08) 50%, rgba(236,72,153,0.08) 100%)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
        'slide-up': 'slideUp 0.6s ease-out',
        'fade-in': 'fadeIn 0.5s ease-out',
        'bounce-in': 'bounceIn 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        slideUp: {
          '0%': { transform: 'translateY(30px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        bounceIn: {
          '0%': { transform: 'scale(0.3)', opacity: '0' },
          '50%': { transform: 'scale(1.05)' },
          '70%': { transform: 'scale(0.9)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
