module.exports = {
  darkMode: 'media',
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          orange: '#F26644',
          'orange-dark': '#d94e2e',
          green: '#42B97E',
          'green-dark': '#2e9664',
          saffron: '#FF9933',
          gold: '#F5C518',
          maroon: '#800000',
          cream: '#FFF8F0',
          navy: '#0F2044',
        }
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(135deg, #0F2044 0%, #1a3a6e 40%, #2e5d4b 100%)',
        'orange-gradient': 'linear-gradient(135deg, #F26644, #FF9933)',
        'green-gradient': 'linear-gradient(135deg, #42B97E, #2e9664)',
        'festival-gradient': 'linear-gradient(135deg, #FF9933 0%, #F26644 50%, #800000 100%)',
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease-out',
        'fade-in': 'fadeIn 0.4s ease-out',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: 0, transform: 'translateY(20px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        }
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgba(0,0,0,0.07), 0 4px 16px 0 rgba(0,0,0,0.06)',
        'card-hover': '0 8px 30px rgba(0,0,0,0.12)',
        'cta': '0 4px 24px rgba(242,102,68,0.35)',
        'green-glow': '0 4px 24px rgba(66,185,126,0.35)',
      }
    }
  },
  plugins: []
}
