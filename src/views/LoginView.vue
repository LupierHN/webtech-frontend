<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { nextTick, ref } from 'vue'
import axios from 'axios'
import router from '@/router'

const apiEndpoint = import.meta.env.VITE_APP_BACKEND_BASE_URL + '/api/auth'
const error = ref<string | undefined>(undefined)

const email = ref<string>('')
const password = ref<string>('')

function loginUser(): void {
  axios
    .post(apiEndpoint + '/login', { email: email.value, password: password.value })
    .then((res) => {
      email.value = ''
      password.value = ''
      localStorage.setItem('accessToken', res.data[0].token)
      localStorage.setItem('refreshToken', res.data[1].token)
      console.log('User logged in')
      error.value = undefined
      nextTick(() => {
        router.push('/')
      })
    })
    .catch((err) => {
      if (err.response.status === 404) {
        error.value = 'Invalid email or password'
      } else {
        error.value = 'An unexpected error occurred: ' + err.message
      }
    })

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
          <p v-if="error" class="text-red-500">{{ error }}</p>
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
