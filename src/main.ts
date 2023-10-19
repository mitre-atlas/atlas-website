import './assets/main.css'
import { useMain } from '@/stores/main';

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
// import router from './router'

// Init our pinia instance
const pinia = createPinia()
const store = useMain(pinia) // pass the instance to our store, instead of inferring it from our Vue app

store.init().then(data => {
  store.$state = data // replace the store's state without our data
  createApp(App).use(pinia).mount('#app')
})

// const app = createApp(App)

// app.use(createPinia())
// app.use(router)

// app.mount('#app')
