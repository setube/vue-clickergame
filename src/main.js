import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import Aura from '@primeuix/themes/aura'
import ConfirmationService from 'primevue/confirmationservice'
import ToastService from 'primevue/toastservice'
import DialogService from 'primevue/dialogservice'
import App from './App.vue'

// 导入图标和自定义样式
import 'primeicons/primeicons.css'
// PrimeVue 4.x不再需要单独导入primevue.min.css

const pinia = createPinia()
const app = createApp(App)

app.use(pinia)
app.use(PrimeVue, {
  theme: {
    preset: Aura,
    options: {
      darkModeSelector: '.dark',
    }
  },
  ripple: true,
})
app.use(ConfirmationService)
app.use(ToastService)
app.use(DialogService)
app.mount('#app')