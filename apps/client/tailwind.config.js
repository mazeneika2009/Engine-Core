/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Warm charcoal surfaces (spec: #1C1917 / #18181B)
        base: '#1C1917',
        coal: '#18181B',
        panel: '#232120',
        raised: '#2A2724',
        // Warm light text
        cream: '#F5F1EA',
        sand: '#A8A29E',
        smoke: '#78716C',
        sage: {
          DEFAULT: '#84A98C',
          deep: '#5E7F64',
          wash: 'rgba(132,169,140,0.12)',
        },
        ochre: {
          DEFAULT: '#D4A373',
          deep: '#A97A4B',
          wash: 'rgba(212,163,115,0.12)',
        },
        clay: {
          DEFAULT: '#C08552',
          deep: '#9A6234',
          wash: 'rgba(192,133,82,0.12)',
        },
        brick: {
          DEFAULT: '#C96A5E',
          wash: 'rgba(201,106,94,0.12)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
    },
  },
  plugins: [],
}
