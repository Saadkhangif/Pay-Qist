export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        'golden-green': '#e6eece', // Light golden green background
        earth: {
          deep: '#1e4632',   // Deep Forest Green
          sage: '#337357',   // Muted Sage Green
          gold: '#c2a65a',   // Muted Gold
          cream: '#f5efeb',  // Warm Cream
          dark: '#1a2420',   // Dark Charcoal for text contrast
        }
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(255,255,255,0.08), 0 20px 60px rgba(15,23,42,0.35)',
      },
      backgroundImage: {
        'hero-grid':
          'linear-gradient(rgba(148,163,184,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.08) 1px, transparent 1px)',
      },
    },
  },
  plugins: [],
};