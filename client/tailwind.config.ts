/* eslint-disable global-require */
/* eslint-disable @typescript-eslint/no-require-imports */
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,tsx,ts,jsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: 'var(--primary) / <alpha-value>',
        secondary: 'var(--secondary) / <alpha-value>',
        positive: 'var(--positive) / <alpha-value>',
        negative: 'var(--negative) / <alpha-value>',
        error: 'var(--error) / <alpha-value>',
        warning: 'var(--warning) / <alpha-value>',
      },
    },
  },
  plugins: [],
};
