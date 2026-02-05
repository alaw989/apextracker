import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import { usePageTitle } from './composables/usePageTitle'
import './style.css'
import './style/_variables.css'
import './style/base.css'
import './style/transitions.css'
import App from './App.vue'

// Create Pinia instance for state management
const pinia = createPinia()

const app = createApp(App)

// Register Pinia before mounting
app.use(pinia)

// Register Vue Router
app.use(router)

// Initialize page title management
usePageTitle()

app.mount('#app')
