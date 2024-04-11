import { createPinia } from 'pinia'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import markdownit from './plugins/markdownit'
import { useMain } from '@/stores/main'
import { createHead } from '@unhead/vue'
import { insertOsano } from './plugins/osano'
import { insertAnalytics } from './plugins/analytics'

const pinia = createPinia()
const app = createApp(App)
const head = createHead()

app.use(router)
app.use(vuetify)
app.use(markdownit)
app.use(pinia)
app.use(head)

insertAnalytics(app)
insertOsano()

// Initialize store
const main = useMain()
await main.init()

app.mount('#app')
