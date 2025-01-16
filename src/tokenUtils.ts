// src/tokenUtils.ts
import { getUser, logout } from '@/userUtils'
import axios, { type AxiosRequestConfig } from 'axios'
import type { Token } from '@/model/token'
import { setIsRefreshing} from '@/main'
import router from '@/router'
import { nextTick } from 'vue'

export let failedQueue: Array<{ resolve: (value: string) => void; reject: (reason?: unknown) => void }> = [];

/**
 * Processes the queue of failed requests after the token is renewed
 *
 * @param error
 * @param token
 */
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

/**
 * Renews the token
 * - If the token is renewed, it will process the queue
 * - If the token is not renewed, it will log the user out
 *
 * @param originalRequest
 * @param resolve
 * @param reject
 */
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

/**
 * Checks if the tokens are still valid
 * - If the user is not logged in, it will log the user out
 * - If the user is logged in and the user is not in the session storage, it will get the user
 */
export async function checkTokens(): Promise<void> {
  const accessToken = localStorage.getItem('accessToken') || ''
  const refreshToken = localStorage.getItem('refreshToken') || ''
  if ((!accessToken || !refreshToken) && (router.currentRoute.value.path !== '/login' && router.currentRoute.value.path !== '/register') && sessionStorage.getItem('logout') !== 'true' && router.currentRoute.value.path !== '/terms') {
    logout();
  }else if (accessToken && refreshToken && router.currentRoute.value.path !== '/login' && router.currentRoute.value.path !== '/register' && router.currentRoute.value.path !== '/terms' && sessionStorage.getItem('user') === null) {
    const user = sessionStorage.getItem('user') || ''
    if (!user) {
      await getUser()
    }
  } else if(router.currentRoute.value.path !== '/login' && router.currentRoute.value.path !== '/register' && sessionStorage.getItem('logout') === 'true'&& router.currentRoute.value.path !== '/terms'){
    nextTick(() => {
      router.push('/login')
    })
  }
}
