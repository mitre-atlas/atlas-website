const fs = require('fs').promises

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
    'plugins/vue-linkify.client.js'
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module',
    '@nuxtjs/vuetify'
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/content
    '@nuxt/content'
  ],

  // Content module configuration: https://go.nuxtjs.dev/config-content
  content: {
    dir: 'static/content'
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    // Needed for fast load-times
    // https://nuxtjs.org/docs/2.x/configuration-glossary/configuration-build#extractcss
    extractCSS: true,
    optimization: {
      splitChunks: {
        cacheGroups: {
          styles: {
            name: 'styles',
            test: /\.(css|vue)$/,
            chunks: 'all',
            enforce: true
          }
        }
      }
    },

    // Needed to use fs module
    // https://github.com/nuxt-community/dotenv-module/issues/11#issuecomment-412322241
    extend: function (config, {isDev, isClient}) {
      config.node = {
        fs: "empty"
      };
  }
  },

  hooks: {},

  generate: {
    fallback: true,
    routes () {
      // TODO Update to use JSON
      const getTactics = fs.readFile('static/data/tactics.json', 'utf-8')
      const getTechniques = fs.readFile('static/data/techniques.json', 'utf-8')
      const getCaseStudies = fs.readFile('static/data/case-studies.json', 'utf-8')

      return Promise.all([getTactics, getTechniques, getCaseStudies])
      .then((contents) => {
        // Parse YAML files
        const [tactics, techniques, studies] = contents.map(JSON.parse)

        // Build out tactics and techniques used in the case studies
        // with which to filter the ATT&CK data
        const studyTactics = new Set()
        const studyTechniques = new Set()
        studies.forEach((study) => {
          study.procedure.forEach((p) => {
            studyTactics.add(p.tactic)
            studyTechniques.add(p.technique)
          })
        })

        // Use only tactics referenced in case studies
        const filteredTactics = tactics.filter((tactic) => {
          // return studyTactics.has(tactic.id) // Use only tactics referenced in case studies
          return true
        })
        const filteredTechniques = techniques.filter((technique) => {
          // return studyTechniques.has(technique.id)
          return true // Use only techniques referenced in case studies
        })

        // Construct each dynamic route
        const tacticRoutes = filteredTactics.map(t => `/tactics/${t.id}`)
        const techniqueRoutes = filteredTechniques.map(t => `/techniques/${t.id}`)
        const studyRoutes = studies.map(s => `/studies/${s.id}`)

        // Combine into a single list and return
        const dynamicRoutes = [...tacticRoutes, ...techniqueRoutes, ...studyRoutes]
        return dynamicRoutes
      })
    }
  },

  publicRuntimeConfig: {
    name: 'AdvML'
  }
}
