// src/tokenUtils.ts
import { logout } from '@/userUtils'
import axios, { type AxiosRequestConfig } from 'axios'
import type { Token } from '@/model/token'
import { setIsRefreshing} from '@/main'

export let failedQueue: Array<{ resolve: (value: string) => void; reject: (reason?: unknown) => void }> = [];

export const processQueue = (error: unknown, token: string | null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token!)
    }
  })
  failedQueue = []
}

export function renewToken(originalRequest: AxiosRequestConfig, resolve: (value: unknown) => void, reject: (reason?: unknown) => void): void {
  axios
    .post<Token>('/auth/renewToken', { token: localStorage.getItem('refreshToken') })
    .then((response) => {
      const token: Token = response.data
      localStorage.setItem('accessToken', token.token)
      axios.defaults.headers.common['Authorization'] = `Bearer ${token.token}`
      if (originalRequest.headers) {
        originalRequest.headers['Authorization'] = `Bearer ${token.token}`
      }
      processQueue(null, token.token)
      resolve(axios(originalRequest))
    })
    .catch((err) => {
      processQueue(err, null)
      if (err.response?.status === 401) {
        logout()
      }
      reject(err)
    })
    .finally(() => {
      setIsRefreshing(false)
    })
}

export function logError(err: unknown): void {
  alert('Something went wrong ... check your browser console for more information')
  console.error(err)
}
export async function checkTokens(): Promise<void> {
  const accessToken = localStorage.getItem('accessToken') || ''
  const refreshToken = localStorage.getItem('refreshToken') || ''


  if ((!accessToken || !refreshToken) && (window.location.pathname !== '/login' && window.location.pathname !== '/register')) {
    logout();
  }
}
