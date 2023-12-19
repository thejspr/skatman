import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'

const app = createApp(App)

app.config.globalProperties.$filters = {
  formatNumber(number) {
    if (!number) {
      return null
    }
    return new Intl.NumberFormat('da-DK', { maximumSignificantDigits: 2 }).format(number)
  }
}

app.mount('#app')
