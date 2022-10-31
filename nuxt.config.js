import fs from 'fs/promises'
import yaml from 'js-yaml'

import packageData from './package.json'
import { dataObjectToRoute } from './assets/dataHelpers.js'

import schema from './static/atlas-data/dist/schemas/atlas_website_case_study_schema.json'

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
    'plugins/vue-linkify.client.js'
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: {
    dirs: [
      '~/components',
      '~/components/case-study-builder',
      '~/components/data-display',
      '~/components/resources'
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
    runtime: true,
    html: true
  },

  // Content module configuration: https://go.nuxtjs.dev/config-content
  content: {
    dir: 'static/content',
    liveEdit: false
  },

  // https://github.com/nuxt-community/vuetify-module#options
  vuetify: {
    treeShake: true,
    optionsPath: './vuetify.options.js'
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
    extend (config, { isDev, isClient }) {
      config.node = {
        fs: 'empty'
      }
    }
  },

  hooks: {},

  generate: {
    fallback: true,
    routes () {
      const getAtlasData = fs.readFile('static/atlas-data/dist/ATLAS.yaml', 'utf-8')

      return Promise.resolve(getAtlasData)
        .then((contents) => {
        // Parse YAML files
          const data = yaml.load(contents)

          // Empty list
          let allDataObjects = []
          let matrixRoutes = []

          // To grab the techniques and tactic objects under matrices and populate allDataObjects
          data.matrices.forEach((matrix) => {
            const { id, name, ...objects } = matrix
            allDataObjects = allDataObjects.concat(Object.values(objects))
            matrixRoutes.push(`/matrices/${id}`)
            const dynamicDataKeys = Object.keys(objects).filter(k => k !== 'case-study')
            matrixRoutes = matrixRoutes.concat(dynamicDataKeys.map(k => `/${k}`))
          })

          // Collect data objects keyed via object-type under the key 'objects'
          const { id, name, version, matrices, ...otherObjects } = data

          // Concat the other objects (i.e casestudies objects) into dallDataObject list
          allDataObjects = allDataObjects.concat(Object.values(otherObjects))

          // Flatten the objects into a single array
          allDataObjects = allDataObjects.flat()

          // Construct each route as a pluralization of the object type (last word) and the object ID
          const dynamicRoutes = allDataObjects.map((obj) => {
            // i.e. studies for case-study, techniques for technique
            return dataObjectToRoute(obj)
          })

          return dynamicRoutes.concat(matrixRoutes)
        })
    }
  },

  publicRuntimeConfig: {
    router_base: process.env.ROUTER_BASE || '/',
    name: {
      short: process.env.NAME_SHORT || 'ATLAS',
      long: process.env.NAME_LONG || 'Adversarial Threat Landscape for Artificial-Intelligence Systems',
      mitre: 'MITRE ATLAS™' // process.env?
    },
    navigator_url: process.env.NAVIGATOR_URL || '',
    contact_email: process.env.CONTACT_EMAIL || 'atlas@mitre.org',
    site_version: process.env.SITE_VERSION || packageData.version,
    study_schema_version: JSON.stringify(schema.$version) || null,
    footer_logo_link: process.env.FOOTER_LOGO_LINK || 'https://www.mitre.org/',
    footer_logo_image: process.env.FOOTER_LOGO_IMAGE || 'mitre-logo-white.svg',
    analytics_id: process.env.ANALYTICS_ID || '',
    individual_case_study: {
      navigator_link: process.env.CASE_STUDY_DATA_URL || 'https://mitre-atlas.github.io/atlas-navigator/#layerURL=',
      raw_link: process.env.RAW_CASE_STUDY_DATA_URL || 'https://raw.githubusercontent.com/mitre-atlas/atlas-navigator-data/main/dist/case-study-navigator-layers/',
      suffix: process.env.CASE_STUDY_DATA_SUFFIX || '.json'
    }
  },

  router: {
    base: process.env.ROUTER_BASE || '/'
  }
}
