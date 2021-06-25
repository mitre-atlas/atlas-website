import Vue from 'vue'
import VueGtag from 'vue-gtag'

export default function ({ app, $config }) {
  // Set up only if analytics ID is provided, i.e. in production
  if ($config.analytics_id) {
    Vue.use(VueGtag, {
      config: {
        id: $config.analytics_id
      }
    },
    app.router
    )
  }
}
