// src/utils.ts
import axios from 'axios'
import type { Token } from '@/model/token'
import router from '@/router'
import { nextTick } from 'vue'

const apiEndpoint = import.meta.env.VITE_APP_BACKEND_BASE_URL + '/api/auth'

export function logError(err: unknown): void {
  alert('Something went wrong ... check your browser console for more information')
  console.error(err)
}

export async function renewToken(): Promise<boolean> {
  const token: Token = { token: localStorage.getItem('refreshToken') || '' }
  if (token.token === '') {
    nextTick(() => {
      router.push('/login')
    })
    return false
  }
  try {
    const response = await axios.post<Token>(apiEndpoint + '/renewToken', token, {
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('accessToken') || ''
      }
    })
    localStorage.setItem('accessToken', response.data.token)
    return true
  } catch (err) {
    if (err.response.status === 401) {
      console.log("renewToken unauthorized")
      localStorage.clear()
      nextTick(() => {
        router.push('/login')
      })
      return false
    }
    console.log("renewToken error")
    localStorage.clear()
    nextTick(() => {
      router.push('/login')
    })
    return false
  }
}

export async function validateToken(): Promise<boolean> {
  const token: Token = { token: localStorage.getItem('accessToken') || '' }
  if (token.token === '') {
    nextTick(() => {
      router.push('/login')
    })
    return false
  }
  try {
    const response = await axios.post<boolean>(apiEndpoint + '/validateToken', token)
    return response.data
  } catch (err) {
    console.log("validateToken error")
    nextTick(() => {
      router.push('/login')
    })
    return false
  }
}


export function checkTokens(): void {
  const accessToken = localStorage.getItem('accessToken') || ''
  const refreshToken = localStorage.getItem('refreshToken') || ''

  if ((!accessToken || !refreshToken) && (window.location.pathname !== '/login' && window.location.pathname !== '/register')) {
    nextTick(() => {
      router.push('/login')
    })
  }
}
