import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import App from './App.vue'

// Create Pinia instance for state management
const pinia = createPinia()

const app = createApp(App)

// Register Pinia before mounting
app.use(pinia)

app.mount('#app')
