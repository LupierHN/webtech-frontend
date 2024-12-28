import './assets/main.css'

import { createApp } from 'vue'
import axios, { type AxiosError, type AxiosRequestConfig, type AxiosResponse } from 'axios'
import App from './App.vue'
import router from './router'
import VueFroala from 'vue-froala-wysiwyg'
import { logout } from '@/userUtils'
import { Bars3Icon, BellIcon, XMarkIcon, UserCircleIcon, FolderIcon } from '@heroicons/vue/24/outline'
// Import Froala Editor
import 'froala-editor/js/plugins.pkgd.min.js'
// Import third party plugins
import 'froala-editor/js/third_party/embedly.min'
import 'froala-editor/js/third_party/font_awesome.min'
import 'froala-editor/js/third_party/spell_checker.min'
import 'froala-editor/js/third_party/image_tui.min'
// Import Froala Editor css files
import 'froala-editor/css/froala_editor.pkgd.min.css'
import 'froala-editor/css/froala_style.min.css'
import { failedQueue, renewToken } from '@/tokenUtils'

const app = createApp(App)
let isRefreshing = false

export function setIsRefreshing(value: boolean): void {
  isRefreshing = value
}
// let failedQueue: Array<{ resolve: (value: string) => void; reject: (reason?: any) => void }> = [];

// Register Heroicons globally
app.component('Bars3Icon', Bars3Icon)
app.component('BellIcon', BellIcon)
app.component('XMarkIcon', XMarkIcon)
app.component('UserCircleIcon', UserCircleIcon)
app.component('FolderIcon', FolderIcon)

// AXIOS CONFIG
app.config.globalProperties.$axios = axios
axios.defaults.baseURL = import.meta.env.VITE_APP_BACKEND_BASE_URL

// const processQueue = (error: unknown, token: string | null) => {
//   failedQueue.forEach((prom) => {
//     if (error) {
//       prom.reject(error)
//     } else {
//       prom.resolve(token!)
//     }
//   })
//   failedQueue = []
// }

axios.interceptors.request.use((config) => {
  console.log('Request made to ' + config.url)
  console.log('Request Body:', config.data)
  // console.log('Request Headers:', config.headers)
  const token = localStorage.getItem('accessToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

axios.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => {
    return response;
  },
  (error: AxiosError): Promise<unknown> => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean }

    if (originalRequest.url?.includes('/auth/renewToken')) {
      logout()
      return Promise.reject(error)
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise<string>((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers['Authorization'] = `Bearer ${token}`
            }else {
              originalRequest.headers = { 'Authorization': `Bearer ${token}` }
            }
            return axios(originalRequest)
          })
          .catch((err) => {
            return Promise.reject(err)
          })
      }
      originalRequest._retry = true
      isRefreshing = true

      const refreshToken = localStorage.getItem('refreshToken')
      if (!refreshToken) {
        logout()
        return Promise.reject(error)
      }

      return new Promise((resolve, reject) => {
        renewToken(originalRequest, resolve, reject)
      })
    }
    return Promise.reject(error)
  }
)

app.use(VueFroala)
app.use(router)

app.mount('#app')
