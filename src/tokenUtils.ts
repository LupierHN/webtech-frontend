// src/tokenUtils.ts
import axios from 'axios'
import type { Token } from '@/model/token'
import router from '@/router'
import { logout } from '@/userUtils'
import { nextTick } from 'vue'

let tokenRenewalTimer: NodeJS.Timeout | null = null;


export function logError(err: unknown): void {
  alert('Something went wrong ... check your browser console for more information')
  console.error(err)
}

export function setTokenRenewalTimer(): void {
  if (tokenRenewalTimer) {
    clearTimeout(tokenRenewalTimer);
  }

  // Set the timer to renew the token 1 minute before it expires (assuming the token expires in 10 minutes)
  const renewTime = 1000 * 60 * 9; // 9 minutes in milliseconds

  tokenRenewalTimer = setTimeout(async () => {
    try {
      await renewToken();
    } catch (err) {
      console.error("Error renewing access Token", err);
      logout();
    }
  }, renewTime);
}

export function resetTokenRenewalTimer(): void {
  if (tokenRenewalTimer) {
    clearTimeout(tokenRenewalTimer);
    tokenRenewalTimer = null;
  }
}

export async function renewToken(): Promise<void> {
  const refreshToken = localStorage.getItem('refreshToken') || '';
  if (!refreshToken) {logout(); throw new Error('No refresh token found');}

  try {
    const response = await axios.post<Token>('/auth/renewToken', { token: refreshToken });
    const accessToken = response.data.token;
    localStorage.setItem('accessToken', accessToken);
    setTokenRenewalTimer();
    console.log('Access Token renewed');
  }catch (err) {
    throw new Error('Error renewing access Token' + err);
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
    const response = await axios.post<boolean>('/auth/validateToken', token)
    return response.data
  } catch (err) {
    console.log("validateToken error"+err)
    nextTick(() => {
      router.push('/login')
    })
    return false
  }
}


export async function checkTokens(): Promise<void> {
  const accessToken = localStorage.getItem('accessToken') || ''
  const refreshToken = localStorage.getItem('refreshToken') || ''


  if ((!accessToken || !refreshToken) && (window.location.pathname !== '/login' && window.location.pathname !== '/register')) {
    logout();
  }else if(accessToken && refreshToken){
    if (!tokenRenewalTimer) {
      console.log('Token Renewal Timer not set')
      await renewToken()
      console.log(tokenRenewalTimer)
    }
  }
}
