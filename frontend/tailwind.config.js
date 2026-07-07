/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#0D1B2A',
          mid: '#1A2E42',
          light: '#2A4560',
        },
        gold: {
          DEFAULT: '#C9A84C',
          light: '#F0D98C',
          dark: '#8B6914',
        },
        cream: {
          DEFAULT: '#F8F4ED',
          dark: '#EDE7DA',
        },
      },
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      },
    },
  },
  plugins: [],
};
