module.exports = {
  prefix: 'tw-',
  // content: [`${srcDir}/pages/resources/*.vue`],
  content (contentDefaults) {
    return ['./pages/resources/*.vue']
  },
  plugins: [require('@tailwindcss/typography')],
  theme: {
    extend: {
      typography: {
        DEFAULT: {
          css: {
            a: {
              'text-decoration': 'none',
              'font-weight': 'unset'
            }
          }
        }
      }
    }
  }
}
