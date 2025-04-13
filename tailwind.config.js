/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      screens: {
        xs: '480px',
        xs2: '200px',
        md: '1026px',
      },
    },
  },
  plugins: [],
};
