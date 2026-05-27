import type { App } from 'vue'
import VueGtag from 'vue-gtag'
import { ANALYTICS_ID, hasAnalytics } from '@/config/env'

export async function insertAnalytics(app: App<Element>) {
  if (hasAnalytics()) {
    app.use(VueGtag, {
      config: { id: ANALYTICS_ID }
    })
  }
}
