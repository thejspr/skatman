import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'

const numberFormat = new Intl.NumberFormat('da-DK', { maximumFractionDigits: 2 })

const app = createApp(App)
app.config.globalProperties.$filters = {
  formatNumber: (number) => numberFormat.format(number ?? 0)
}
app.mount('#app')
