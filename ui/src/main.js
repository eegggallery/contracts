import { createApp } from 'vue'
import { createPinia } from 'pinia'
import Notifications from '@kyvg/vue3-notification'
import './style.css'
import App from './App.vue'

import AppButton from './elements/Button.vue'
import AppInput from './elements/Input.vue'

const app = createApp(App)

const pinia = createPinia()

app.use(Notifications)
app.use(pinia)

app.component('AppButton', AppButton)
app.component('AppInput', AppInput)

app.mount('#app')
