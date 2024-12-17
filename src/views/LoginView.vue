<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { ref, watch } from 'vue'
import axios from 'axios'
import type { User } from '@/model/user'
import type { Token } from '@/model/token'
import { logError } from '@/utils'

const apiEndpoint = import.meta.env.VITE_APP_BACKEND_BASE_URL + '/api/auth'
const error = ref<string | undefined>(undefined)
const tokens = ref<Token[]>([])

const email = ref<string>('')
const password = ref<string>('')

function loginUser(): void {
  axios
    .post<Token[]>(apiEndpoint + '/login', { email: email.value, password: password.value })
    .then((res) => {
      email.value = ''
      password.value = ''
      tokens.value.push(...res.data)
    })
    .catch((err) => {
      logError(err)
      if (err.response) {
        error.value = err.response.data.message
      } else if (err.request) {
        error.value = 'No response received from the server. Please check your network connection.'
      } else {
        error.value = 'An unexpected error occurred: ' + err.message
      }
    })
  console.log('User logged in')
  error.value = undefined
}
</script>

<template>
  <div class="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-sm">
      <img class="mx-auto h-10 w-auto" src="https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=600" alt="Your Company" />
      <h2 class="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">Sign in to your account</h2>
    </div>

    <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
      <form class="space-y-6" @submit.prevent="loginUser">
        <div>
          <label for="email" class="block text-sm/6 font-medium text-gray-900">Email address</label>
          <div class="mt-2">
            <input v-model="email" type="email" name="email" id="email" autocomplete="email" required class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" />
          </div>
        </div>

        <div>
          <div class="flex items-center justify-between">
            <label for="password" class="block text-sm/6 font-medium text-gray-900">Password</label>
            <div class="text-sm">
              <a href="#" class="font-semibold text-indigo-600 hover:text-indigo-500">Forgot password?</a>
            </div>
          </div>
          <div class="mt-2">
            <input v-model="password" type="password" name="password" id="password" autocomplete="current-password" required class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" />
          </div>
        </div>

        <div>
          <button type="submit" class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Sign in</button>
        </div>
      </form>

      <p class="mt-10 text-center text-sm/6 text-gray-500">
        Not a member?
        {{ ' ' }}
        <RouterLink to="/register" class="font-semibold text-indigo-600 hover:text-indigo-500">Register now</RouterLink>
      </p>
    </div>
  </div>
</template>

<style scoped>
</style>
