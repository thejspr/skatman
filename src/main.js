import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'

const app = createApp(App)

app.config.globalProperties.$filters = {
  formatNumber(number) {
    if (!number) { return null }
    return number.toLocaleString('da-DK', { maximumFractionDigits: 2 })
  }
}

app.mount('#app')
