import './assets/main.css'

import { createApp } from 'vue'
import axios from 'axios'
import App from './App.vue'
import router from './router'
import { logout } from '@/userUtils'
import { Bars3Icon, BellIcon, XMarkIcon, UserCircleIcon, FolderIcon } from '@heroicons/vue/24/outline'

const app = createApp(App)

// Register Heroicons globally
app.component('Bars3Icon', Bars3Icon)
app.component('BellIcon', BellIcon)
app.component('XMarkIcon', XMarkIcon)
app.component('UserCircleIcon', UserCircleIcon)
app.component('FolderIcon', FolderIcon)

// AXIOS CONFIG
app.config.globalProperties.$axios = axios
axios.defaults.baseURL = import.meta.env.VITE_APP_BACKEND_BASE_URL

axios.interceptors.request.use((config) => {
  console.log('Request made to ' + config.url)
  const token = localStorage.getItem('accessToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        logout()
      } else {
        console.error('Error response:', error.response)
      }
    }
    return Promise.reject(error)
  }
)

app.use(router)

app.mount('#app')
