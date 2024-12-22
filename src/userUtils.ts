import { nextTick} from 'vue'
import router from '@/router'
import axios from 'axios'
import type { Token } from '@/model/token'
import { setTokenRenewalTimer , resetTokenRenewalTimer} from '@/tokenUtils'
import type { User } from '@/model/user'

export async function login(credentials: { email: string; password: string }): Promise<{ error?: string }> {
  try {

    const response = await axios.post<Token[]>('/auth/login', credentials)

    const tokens: Token[] = response.data
    localStorage.setItem('refreshToken', tokens[1].token)
    localStorage.setItem('accessToken', tokens[0].token)
    setTokenRenewalTimer()
    getUser()
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
  sessionStorage.clear()
  delete axios.defaults.headers.common['Authorization']
  nextTick(() => {
    router.push('/login')
  })
}

async function getUser(): Promise<void> {
  try {
    const response = await axios.get<User>('/auth/get')
    sessionStorage.setItem('user', JSON.stringify(response.data))
  } catch (err) {
    console.error('Error getting user', err)
  }
}
