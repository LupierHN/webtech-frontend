import { nextTick} from 'vue'
import router from '@/router'
import axios from 'axios'
import type { Token } from '@/model/token'
import type { User } from '@/model/user'

/**
 * Logs the user in
 *
 * @param credentials
 */
export async function login(credentials: { email: string; password: string }): Promise<{ error?: string }> {
  //new User Object
  const user: User = {email: credentials.email, password: credentials.password, uId: 0, username: '', firstName: '', lastName: ''}
  try {
    const response = await axios.post<Token[]>('/auth/login', user)

    const tokens: Token[] = response.data
    localStorage.setItem('refreshToken', tokens[1].token)
    localStorage.setItem('accessToken', tokens[0].token)
    await getUser()
    await nextTick(() => {
      router.push('/dashboard')
    })
    return {}
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err) {
    return { error: 'Login failed' }
  }
}

/**
 * Registers the user
 *
 * @param user User
 */
export async function register(user: User): Promise<{ error?: string }> {
  try {
    const response = await axios.post<Token[]>('/auth/register', user)

    const tokens: Token[] = response.data
    localStorage.setItem('accessToken', tokens[0].token)
    localStorage.setItem('refreshToken', tokens[1].token)
    await getUser()
    await nextTick(() => {
      router.push('/dashboard')
    })
    return {}
  } catch (err: unknown) {
    const errorMessage = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
    return { error: errorMessage || 'An error occurred' };
  }
}

/**
 * Logs the user out
 * - Clears the local and session storage
 * - Deletes the authorization header
 * - Redirects the user to the login page
 */
export function logout(): void {
  localStorage.clear()
  sessionStorage.clear()
  delete axios.defaults.headers.common['Authorization']
  nextTick(() => {
    router.push('/login')
  })
}

/**
 * Gets the user from the server and stores it in the session storage
 */
export async function getUser(): Promise<void> {
  try {
    const response = await axios.get<User>('/auth/get')
    sessionStorage.setItem('user', JSON.stringify(response.data))
  } catch (err) {
    console.error('Error getting user', err)
  }
}
