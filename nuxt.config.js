export default {
  // Target: https://go.nuxtjs.dev/config-target
  target: 'static',

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'Adversarial ML Threat Matrix',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module'
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/bootstrap
    'bootstrap-vue/nuxt',
    // https://go.nuxtjs.dev/content
    '@nuxt/content'
  ],

  // Content module configuration: https://go.nuxtjs.dev/config-content
  content: {},

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
  },

  hooks: {
    'content:file:beforeParse': (file) => {

      console.log(file.path)
      if (file.path.includes('tactics_full.yaml') || file.path.includes('techniques_full.yaml')) {
        // Insert a - before each non-empty-line non-comment --- or #
        // Match up until the :
        // var regex = /^([^\s-#]+):/gm // includes files that have ---, like tactics and techniques.yaml
        var regex = /^([^\s#]+):/gm // no ----

        // Debug
        // var match = regex.exec(file.data)
        // while (match != null) {
        //   console.log(match[0])
        //   match = regex.exec(file.data)
        // }

        // Make each entry a list object, with ID
        file.data = file.data.replace(regex, '- id: $1')

        // Prepend list root after document separator
        // file.data = file.data.replace('---', '---\nitems:') // When there is a ----
        file.data = 'items:\n' + file.data
        // console.log(file.data);
      }
    },

    'content:options': (options) => {
      // console.log('Content options:', options)
    }
  }
}
