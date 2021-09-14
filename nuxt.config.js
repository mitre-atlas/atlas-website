const fs = require('fs').promises
const yaml = require('js-yaml')

export default {
  // Target: https://go.nuxtjs.dev/config-target
  target: 'static',

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'MITRE | ATLAS™',
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
    'plugins/vue-gtag.client.js',
    'plugins/vue-linkify.client.js',
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: {
    dirs: [
      '~/components',
      '~/components/case-study-builder'
    ]
  },

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/router-extras',
    '@nuxtjs/eslint-module',
    '@nuxtjs/vuetify'
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/content
    '@nuxt/content',
    'vue-scrollto/nuxt',
    '@nuxtjs/markdownit'
  ],

  // https://github.com/markdown-it/markdown-it
  markdownit: {
    breaks: false,
    runtime: true
  },

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
      const getAtlasData = fs.readFile('static/data/ATLAS-2.0.yaml', 'utf-8')

      return Promise.resolve(getAtlasData)
      .then((contents) => {
        // Parse YAML files
        const doc = yaml.load(contents)
        const studies = doc['case-studies']
        const techniques = doc['techniques']
        const tactics = doc['tactics']

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
          // return studyTechniques.has(technique.id) // Use only techniques referenced in case studies
          // return true
          return technique.id.startsWith('AML') // Use only ATLAS techniques
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
    router_base: process.env.ROUTER_BASE || '/',
    name: {
      short: process.env.NAME_SHORT || 'ATLAS',
      long: process.env.NAME_LONG || 'Adversarial Threat Landscape for Artificial-Intelligence Systems',
      mitre: 'MITRE ATLAS™' //process.env?
    },
    navigator_url: process.env.NAVIGATOR_URL || 'https://mitre.github.io/atlas-navigator/',
    advml: {
      repo_url: process.env.ADVML_DATA_URL || '#',
      version: process.env.ADVML_DATA_VERSION || 2
    },
    attack: {
      repo_url: process.env.ATTACK_ENTERPRISE_URL || 'https://github.com/mitre/cti/tree/master/enterprise-attack',
      version: process.env.ATTACK_ENTERPRISE_VERSION || 9
    },
    analytics_id: process.env.ANALYTICS_ID || '',
    individual_case_study:{
      navigator_link:process.env.CASE_STUDY_DATA_URL || 'https://mitre.github.io/atlas-navigator/#layerURL=https%3A%2F%2Fraw.githubusercontent.com%2Fmitre%2Fadvmlthreatmatrix%2Fgh-pages%2Fdata%2Fcase-study-layers%2F',
      raw_link:process.env.RAW_CASE_STUDY_DATA_URL || 'https://raw.githubusercontent.com/mitre/advmlthreatmatrix/gh-pages/data/case-study-layers/',
      suffix:process.env.CASE_STUDY_DATA_SUFFIX || '-case_study_layer.json'
    }
    },

  router: {
    base: process.env.ROUTER_BASE || '/'
  }
}
