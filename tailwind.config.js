module.exports = {
  purge: {
    content: ['./src/**/*.tsx', './src/**/*.jsx'],
    enabled: process.env.NODE_ENV === 'production',
  },
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
