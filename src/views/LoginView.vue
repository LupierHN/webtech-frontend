<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { nextTick, ref } from 'vue'
import router from '@/router'
import { login } from '@/userUtils'

const error = ref<string | undefined>(undefined)
const email = ref<string>('')
const password = ref<string>('')

async function loginUser(): Promise<void> {
  try {
    const response = await login({ email: email.value, password: password.value })
    if (response.error) {
      error.value = 'Benutzername oder Passwort falsch'
    } else {
      await nextTick(() => {
        router.push('/')
      })
    }
  } catch (err) {
    error.value = 'Benutzername oder Passwort falsch'
    console.error(err)
  }
}

</script>

<template>
  <div
    class="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8"
  >
    <div class="sm:mx-auto sm:w-full sm:max-w-sm">
      <img
        class="mx-auto h-10 w-auto"
        src="https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=600"
        alt="Your Company"
      />
      <h2
        class="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900 dark:text-white"
      >
        Sign in to your account
      </h2>
    </div>

    <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
      <form class="space-y-6" @submit.prevent="loginUser">
        <div>
          <label for="email" class="block text-sm/6 font-medium text-gray-900 dark:text-white">Email address</label>
          <div class="mt-2">
            <input
              v-model="email"
              type="email"
              name="email"
              id="email"
              autocomplete="email"
              required
              class="block w-full rounded-md bg-gray-50 dark:bg-gray-900 px-3 py-1.5 text-base text-gray-900 dark:text-white outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
            />
          </div>
        </div>

        <div>
          <div class="flex items-center justify-between">
            <label for="password" class="block text-sm/6 font-medium text-gray-900 dark:text-white">Password</label>
            <div class="text-sm">
              <a
                href="#"
                class="font-semibold text-indigo-600 hover:text-indigo-500"
                >Forgot password?</a
              >
            </div>
          </div>
          <div class="mt-2">
            <input
              v-model="password"
              type="password"
              name="password"
              id="password"
              autocomplete="current-password"
              required
              class="block w-full rounded-md bg-gray-50 dark:bg-gray-900 px-3 py-1.5 text-base text-gray-900 dark:text-white outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
            />
          </div>
        </div>

        <div>
          <p v-if="error" class="text-red-500">{{ error }}</p>
          <button
            type="submit"
            class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Sign in
          </button>
        </div>
      </form>

      <p class="mt-10 text-center text-sm/6 text-gray-300">
        Not a member?
        {{ ' ' }}
        <RouterLink
          to="/register"
          class="font-semibold text-indigo-600 hover:text-indigo-500"
          >Register now</RouterLink
        >
      </p>
    </div>
  </div>
</template>

<style scoped></style>
