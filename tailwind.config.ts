import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        concierge: {
          navy: '#13294b',
          slate: '#34495e',
          cloud: '#f3f6fa',
          steel: '#a4b0be'
        }
      },
      boxShadow: {
        concierge: '0 8px 24px rgba(19, 41, 75, 0.12)'
      }
    }
  },
  plugins: []
};

export default config;
