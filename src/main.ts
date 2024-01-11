import { createPinia } from 'pinia'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import { loadFonts } from './plugins/webfontloader'
import markdownit from './plugins/markdownit'
import { useMain } from "@/stores/main";

const pinia = createPinia();
const app = createApp(App);

app.use(router);
app.use(vuetify);
app.use(markdownit);
app.use(pinia);

// Initialize store
const main = useMain();
await main.init();

app.mount('#app');

loadFonts()
