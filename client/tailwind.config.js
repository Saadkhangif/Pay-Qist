import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    path.join(__dirname, 'index.html'),
    path.join(__dirname, 'src/**/*.{js,jsx,ts,tsx}'),
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        sm: '1.5rem',
        lg: '2rem',
      },
      screens: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1400px',
      },
    },
    extend: {
      screens: {
        xs: '400px',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#0F9D58',
          600: '#0d8a4d',
          700: '#0b7340',
          800: '#095c34',
          900: '#074528',
        },
        'golden-green': '#e6eece',
        earth: {
          deep: '#1e4632',
          sage: '#337357',
          gold: '#c2a65a',
          cream: '#f5efeb',
          dark: '#1a2420',
        },
        surface: {
          dark: '#070b0f',
          raised: '#0f1519',
          overlay: '#151d23',
          muted: '#1a2229',
        },
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(255,255,255,0.08), 0 20px 60px rgba(15,23,42,0.35)',
        'glow-brand': '0 8px 32px rgba(15, 157, 88, 0.15)',
        'glow-brand-lg': '0 12px 48px rgba(15, 157, 88, 0.25), 0 0 0 1px rgba(52, 211, 153, 0.1)',
        'dark-card': '0 4px 24px rgba(0, 0, 0, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.04)',
        'dark-card-hover': '0 16px 48px rgba(0, 0, 0, 0.55), 0 0 32px rgba(15, 157, 88, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.06)',
        card: '0 4px 24px rgba(15, 23, 42, 0.06)',
        'card-hover': '0 12px 40px rgba(15, 157, 88, 0.12)',
      },
      backgroundImage: {
        'hero-grid':
          'linear-gradient(rgba(148,163,184,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.08) 1px, transparent 1px)',
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'dark-aurora':
          'radial-gradient(ellipse 80% 55% at 50% -15%, rgba(15, 157, 88, 0.18), transparent 55%), radial-gradient(ellipse 55% 45% at 100% 20%, rgba(52, 211, 153, 0.1), transparent 50%), radial-gradient(ellipse 45% 35% at 0% 70%, rgba(15, 157, 88, 0.08), transparent 50%), radial-gradient(ellipse 40% 30% at 80% 90%, rgba(16, 185, 129, 0.06), transparent 50%)',
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease-out both',
        float: 'float 6s ease-in-out infinite',
        marquee: 'marquee 30s linear infinite',
        'glow-pulse': 'glowPulse 4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
