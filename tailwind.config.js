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
  corePlugins: {
    preflight: true,
  },
  variants: {
    extend: {
      userDrag: ['responsive'],
    },
  },
  theme: {
    extend: {
      screens: {
        xs: '480px',
        xs2: '200px',
        md: '1026px',
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      const newUtilities = {
        '.drag-none': {
          '-webkit-user-drag': 'none',
          '-khtml-user-drag': 'none',
          '-moz-user-drag': 'none',
          '-o-user-drag': 'none',
          'user-drag': 'none',
          'pointer-events': 'none',
        },
      };
      addUtilities(newUtilities);
    },
  ],
};
