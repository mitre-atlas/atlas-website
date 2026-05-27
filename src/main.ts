import { createPinia } from 'pinia'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import markdownit from './plugins/markdownit'
import { useMain } from '@/stores/main'
import { createHead } from '@unhead/vue/client'
import { insertOsano } from './plugins/osano'
import { insertAnalytics } from './plugins/analytics'

const pinia = createPinia()
const app = createApp(App)
const head = createHead()

const PREFERRED_VERSION_CLEAR_SECTIONS = new Set(['home', 'data', 'studies', 'matrices'])

app.use(router)
app.use(vuetify)
app.use(markdownit)
app.use(pinia)
app.use(head)

insertAnalytics(app)
insertOsano()

// Initialize store
const main = useMain()
main.LOAD_PREFERRED_VERSION()

function syncPreferredVersionForRoute(routeLike: {
  params?: Record<string, unknown>
  meta?: Record<string, unknown>
}) {
  const nextVersion = typeof routeLike?.params?.version === 'string' ? routeLike.params.version : ''
  if (nextVersion) {
    main.SET_PREFERRED_VERSION(nextVersion)
    return
  }

  const section = typeof routeLike?.meta?.section === 'string' ? routeLike.meta.section : ''
  if (PREFERRED_VERSION_CLEAR_SECTIONS.has(section)) {
    main.SET_PREFERRED_VERSION('')
  }
}

await router.isReady()

let loadedVersion = ''
const initialVersion =
  typeof router.currentRoute.value.params.version === 'string'
    ? router.currentRoute.value.params.version
    : ''
syncPreferredVersionForRoute(router.currentRoute.value)
main.SYNC_ROUTE_VERSION(router.currentRoute.value)
try {
  await main.loadData(initialVersion)
  loadedVersion = initialVersion
} catch (error) {
  console.error('Failed to load initial ATLAS data', error)
  if (initialVersion) {
    await router.replace({ name: 'VersionedErrorNotFound', params: { version: initialVersion } })
  } else {
    await router.replace({ name: 'ErrorNotFound' })
  }
}

main.LOAD_LATEST_KNOWN_VERSION().catch((error) => {
  console.warn('Failed to load canonical latest ATLAS version', error)
})

router.afterEach(async (to) => {
  if (to.meta?.section === 'error') {
    return
  }

  syncPreferredVersionForRoute(to)
  main.SYNC_ROUTE_VERSION(to)
  const nextVersion = typeof to.params.version === 'string' ? to.params.version : ''
  const hasDataLoadError = Boolean(main.dataLoadError)
  if (nextVersion !== loadedVersion || hasDataLoadError) {
    try {
      await main.loadData(nextVersion)
      loadedVersion = nextVersion
    } catch (error) {
      console.error('Failed to load ATLAS data for route', error)
      if (nextVersion) {
        await router.replace({ name: 'VersionedErrorNotFound', params: { version: nextVersion } })
      } else {
        await router.replace({ name: 'ErrorNotFound' })
      }
    }
  }
})

app.mount('#app')
