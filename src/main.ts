import { createPinia } from 'pinia'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import { loadFonts } from './plugins/webfontloader'
import markdownit from './plugins/markdownit'
import { useMain } from "@/stores/main";
import { createHead } from '@unhead/vue'

const pinia = createPinia();
const app = createApp(App);
const head = createHead()

app.use(router);
app.use(vuetify);
app.use(markdownit);
app.use(pinia);
app.use(head)


// Initialize store
const main = useMain();
await main.init();

app.mount('#app');

loadFonts()
