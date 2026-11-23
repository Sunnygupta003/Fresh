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
          50:  '#f0faf2',
          100: '#d9f2de',
          200: '#b5e5bf',
          300: '#82d095',
          400: '#4db866',
          500: '#2a9d47',
          600: '#1a7d35',
          700: '#16652c',
          800: '#145126',
          900: '#0f3d1d',
          DEFAULT: '#1A6B2A',
        },
        accent: {
          DEFAULT: '#4CAF50',
          light: '#81C784',
          dark: '#388E3C',
        },
        leaf: '#84CC16',
        earth: '#8B5E3C',
        cream: '#FFF8F0',
        sage:  '#87AE73',
        bg: {
          DEFAULT: '#F8FBF5',
          card: '#FFFFFF',
          section: '#F2F7EE',
        },
        text: {
          DEFAULT: '#1C1C1C',
          secondary: '#4A5568',
          muted: '#718096',
          light: '#A0AEC0',
        },
        border: {
          DEFAULT: '#E2EBD9',
          light: '#EEF4E8',
        },
        success: '#22C55E',
        warning: '#F59E0B',
        danger:  '#EF4444',
        info:    '#3B82F6',
      },
      fontFamily: {
        display: ['Poppins', 'sans-serif'],
        body:    ['Inter', 'sans-serif'],
      },
      fontSize: {
        '2xs': ['0.65rem', { lineHeight: '1rem' }],
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      boxShadow: {
        'card':  '0 2px 16px rgba(26,107,42,0.07)',
        'hover': '0 8px 32px rgba(26,107,42,0.15)',
        'float': '0 16px 48px rgba(26,107,42,0.18)',
        'glow':  '0 0 40px rgba(26,107,42,0.2)',
        'inner-green': 'inset 0 0 20px rgba(26,107,42,0.05)',
      },
      backgroundImage: {
        'hero-gradient':    'linear-gradient(135deg, #F8FBF5 0%, #E8F5E9 50%, #F0FDF4 100%)',
        'green-gradient':   'linear-gradient(135deg, #1A6B2A 0%, #2E7D32 50%, #4CAF50 100%)',
        'card-gradient':    'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(240,250,240,0.8) 100%)',
        'section-gradient': 'linear-gradient(180deg, #F8FBF5 0%, #E8F5E9 100%)',
      },
      animation: {
        'float':        'float 6s ease-in-out infinite',
        'float-slow':   'float 9s ease-in-out infinite',
        'spin-slow':    'spin 20s linear infinite',
        'pulse-green':  'pulseGreen 2s ease-in-out infinite',
        'slide-in-left':'slideInLeft 0.6s ease-out',
        'bounce-light': 'bounceLight 2s ease-in-out infinite',
        'marquee':      'marquee 30s linear infinite',
        'orbit':        'orbit 20s linear infinite',
        'orbit-rev':    'orbit 28s linear infinite reverse',
        'count-up':     'countUp 2s ease-out forwards',
        'shimmer':      'shimmer 2s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-18px)' },
        },
        bounceLight: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-8px)' },
        },
        pulseGreen: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(26,107,42,0.4)' },
          '70%':      { boxShadow: '0 0 0 12px rgba(26,107,42,0)' },
        },
        slideInLeft: {
          from: { opacity: '0', transform: 'translateX(-30px)' },
          to:   { opacity: '1', transform: 'translateX(0)' },
        },
        marquee: {
          from: { transform: 'translateX(0)' },
          to:   { transform: 'translateX(-50%)' },
        },
        orbit: {
          from: { transform: 'rotate(0deg) translateX(180px) rotate(0deg)' },
          to:   { transform: 'rotate(360deg) translateX(180px) rotate(-360deg)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        countUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
      },
      backdropBlur: { xs: '2px' },
    },
  },
  plugins: [],
}
