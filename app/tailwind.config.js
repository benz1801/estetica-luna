/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#FBF8F2',
          100: '#F6F1E7',
          200: '#EFE6D3',
        },
        ink: {
          900: '#1F1B16',
          800: '#2A2520',
          700: '#3F3830',
          500: '#6B6258',
          400: '#8A8077',
        },
        sage: {
          50: '#F1F4EE',
          100: '#DDE5D4',
          300: '#9DB28A',
          500: '#6B8456',
          600: '#586E47',
          700: '#46593A',
          900: '#2C3A24',
        },
        rose: {
          50: '#FBF1ED',
          100: '#F3DAD1',
          300: '#E1A99B',
          500: '#C97E6B',
        },
        bronze: {
          400: '#B89274',
          500: '#9C7659',
          700: '#6B4F3A',
        },
        botanical: {
          900: '#1B2A1E',
          800: '#26352A',
        },
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        widest2: '0.28em',
      },
      boxShadow: {
        soft: '0 18px 60px -28px rgba(31, 27, 22, 0.25)',
        ring: '0 0 0 1px rgba(31, 27, 22, 0.06)',
        leaf: '0 30px 80px -40px rgba(70, 89, 58, 0.35)',
      },
      borderRadius: {
        '3xl': '1.75rem',
      },
      keyframes: {
        floatY: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        riseIn: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slowSpin: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        pulseRing: {
          '0%': { transform: 'scale(0.9)', opacity: '0.7' },
          '70%': { transform: 'scale(1.6)', opacity: '0' },
          '100%': { transform: 'scale(1.6)', opacity: '0' },
        },
        clockRock: {
          '0%, 100%': { transform: 'rotate(-0.4deg)' },
          '50%': { transform: 'rotate(0.4deg)' },
        },
      },
      animation: {
        floatY: 'floatY 8s ease-in-out infinite',
        riseIn: 'riseIn 0.9s cubic-bezier(0.22, 1, 0.36, 1) both',
        slowSpin: 'slowSpin 80s linear infinite',
        pulseRing: 'pulseRing 2.6s cubic-bezier(0.22, 1, 0.36, 1) infinite',
        clockRock: 'clockRock 9s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
