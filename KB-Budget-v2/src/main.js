import { createApp } from 'vue'

import './assets/theme.css'
import App from './App.vue'
import router from './router'
import { createAppPinia } from './plugins/pinia.js'

const app = createApp(App)

app.use(createAppPinia())
app.use(router)

app.mount('#app')
