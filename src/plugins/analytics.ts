import type { App } from "vue"
import VueGtag from "vue-gtag"

export async function insertAnalytics (app: App<Element>) {

  if(import.meta.env.VITE_ANALYTICS_ID) {
    app.use(VueGtag, {
      config: { id: import.meta.env.VITE_ANALYTICS_ID }
    })
  }

}