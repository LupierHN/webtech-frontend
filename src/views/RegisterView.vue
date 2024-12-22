<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { nextTick, ref, watch } from 'vue'
import axios from 'axios'
import { logError } from '@/tokenUtils'
import router from '@/router'

const error = ref<string | undefined>(undefined)
const usernameTaken = ref<boolean>(false)
const emailTaken = ref<boolean>(false)

const email = ref<string>('')
const username = ref<string>('')
const firstName = ref<string>('')
const lastName = ref<string>('')
const password = ref<string>('')
const confirmPassword = ref<string>('')

watch(confirmPassword, (newVal) => {
  if (newVal !== password.value) {
    error.value = 'Passwords do not match'
  } else {
    error.value = undefined
  }
})

watch(username, (newVal) => {
  if (!newVal) {
    usernameTaken.value = false
    return
  }
  axios.get('/auth/find/' + newVal)
    .then((response) => {
      usernameTaken.value = !!response.data;
    })
    .catch((error) => {
      console.error(error)
      usernameTaken.value = false
    })
})

watch(email, (newVal) => {
  if (!newVal) {
    emailTaken.value = false
    return
  }
  axios.get('/auth/finde/' + newVal)
    .then((response) => {
      emailTaken.value = !!response.data;
    })
    .catch((error) => {
      console.error(error)
      emailTaken.value = false
    })
})


function registerUser(): void {
  axios
    .post('/auth/register', { email: email.value, password: password.value, username: username.value, firstName: firstName.value, lastName: lastName.value })
    .then((res) => {
      email.value = ''
      password.value = ''
      localStorage.setItem('accessToken', res.data[0].token)
      localStorage.setItem('refreshToken', res.data[1].token)
      console.log('User logged in')
      nextTick(() => {
        router.push('/')
      })
      error.value = undefined
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
}
</script>

<template>
  <section class="bg-gray-50 dark:bg-gray-900">
    <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
      <a href="#" class="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
        <img class="w-8 h-8 mr-2" src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg" alt="logo">
        Flowbite
      </a>
      <div class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
        <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
          <h1 class="text-xl font-bold leading-tight tracking-tight md:text-2xl text-gray-900 dark:text-white">
            Create an account
          </h1>
          <form class="space-y-4 md:space-y-6" @submit.prevent="registerUser">
            <div v-if="error" class="text-red-500">{{ error }}</div>
            <div>
              <label for="username" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Username</label>
              <input v-model="username" type="text" name="username" id="username" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="john_doe" required>
              <p v-if="usernameTaken" class="text-red-500">Username is already taken</p>
            </div>
            <div>
              <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
              <input v-model="email" type="email" name="email" id="email" autocomplete="email" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@company.com" required>
              <p v-if="emailTaken" class="text-red-500">Email is already taken</p>
            </div>
            <div class="flex gap-4">
              <div>
                <label for="firstName" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">First Name</label>
                <input v-model="firstName" type="text" name="firstName" id="firstName" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="John" required>
              </div>
              <div>
                <label for="lastName" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Last Name</label>
                <input v-model="lastName" type="text" name="lastName" id="lastName" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Doe" required>
              </div>
            </div>
            <div>
              <label for="password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
              <input v-model="password" type="password" name="password" id="password" placeholder="••••••••" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required>
            </div>
            <div>
              <label for="confirm-password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Confirm password</label>
              <input v-model="confirmPassword" :class="{'border-red-500': error, 'focus:border-red-500': error, 'focus:ring-red-500': error}" type="password" name="confirm-password" id="confirm-password" placeholder="••••••••" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required>
            </div>
            <div class="flex items-start">
              <div class="flex items-center h-5">
                <input id="terms" aria-describedby="terms" type="checkbox" class="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800" required>
              </div>
              <div class="ml-3 text-sm">
                <label for="terms" class="font-light text-gray-500 dark:text-gray-300">I accept the <a class="font-medium text-primary-600 hover:underline dark:text-primary-500" href="#">Terms and Conditions</a></label>
              </div>
            </div>
            <button type="submit" :disabled="error || usernameTaken || emailTaken" class="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 disabled:opacity-50">Create an account</button>
            <p class="text-sm font-light text-gray-500 dark:text-gray-400">
              Already have an account?
              <RouterLink to="/login" class="font-medium text-primary-600 hover:underline dark:text-primary-500">Login here</RouterLink>
            </p>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>
