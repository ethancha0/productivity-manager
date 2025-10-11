/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx,css}', // include .css if you use @layer overrides
  ],
  theme: {
    extend: {
      fontFamily: {
        roboto: ['Roboto', 'sans-serif'],
        // If you want Roboto as your default sans:
        // sans: ['Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
