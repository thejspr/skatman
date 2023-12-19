import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'

const app = createApp(App)

app.config.globalProperties.$filters = {
  formatNumber(number, round = true, decimals = 2) {
    if (!number) {
      return null
    }

    if (round) {
      return new Intl.NumberFormat('da-DK', { maximumFractionDigits: decimals }).format(number)
    }

    return new Intl.NumberFormat('da-DK', {}).format(number)
  }
}

app.mount('#app')
