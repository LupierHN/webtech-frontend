import { nextTick} from 'vue'
import router from '@/router'
import axios from 'axios'
import type { Token } from '@/model/token'
import { setTokenRenewalTimer , resetTokenRenewalTimer} from '@/tokenUtils'

export async function login(credentials: { email: string; password: string }): Promise<{ error?: string }> {
  try {

    const response = await axios.post<Token[]>('/auth/login', credentials)

    const tokens: Token[] = response.data
    localStorage.setItem('refreshToken', tokens[1].token)
    localStorage.setItem('accessToken', tokens[0].token)
    setTokenRenewalTimer()
    nextTick(() => {
      router.push('/')
    })
    return {}
  } catch (err) {
    return { error: 'Login failed' }
  }
}

export function logout(): void {
  resetTokenRenewalTimer()
  console.log('Logging out')
  localStorage.clear()
  delete axios.defaults.headers.common['Authorization']
  nextTick(() => {
    router.push('/login')
  })
}
