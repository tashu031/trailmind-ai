/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#FDFBF7',
          100: '#FAF8F5',
          200: '#F4F0E6',
          300: '#EAE3D2',
          400: '#DDD2BA',
        },
        forest: {
          50: '#F2F7F2',
          100: '#E1EFE2',
          200: '#C2DEC3',
          500: '#3A7D44',
          600: '#2D5A27',
          700: '#21461D',
          800: '#183616',
          900: '#0F240E',
        },
        earth: {
          moss: '#5B7A58',
          sage: '#7C9885',
          terracotta: '#C86D51',
          sand: '#D9CBBA',
          bark: '#3B332A',
          stone: '#E8E4DC',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        serif: ['Newsreader', 'Georgia', 'serif'],
        mono: ['JetBrains Mono', 'Menlo', 'monospace'],
      }
    },
  },
  plugins: [],
}
