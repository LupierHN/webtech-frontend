<script setup lang="ts">
import { Disclosure, DisclosureButton } from '@headlessui/vue'
import { Bars3Icon, BellIcon, XMarkIcon , UserCircleIcon , PencilIcon} from '@heroicons/vue/24/outline'
import type { User } from '@/model/user'
import { logout } from '@/userUtils'
import { ref, watch } from 'vue'
import { RouterLink } from 'vue-router'
import { escapeHtml , unescapeHtml} from '@/utils'
import axios from 'axios'
import type { Document } from '@/model/document'

const userJSON = sessionStorage.getItem('user')
const user: User = userJSON ? JSON.parse(userJSON) : { username: '', email: '' }


const searchTerm = ref<string>('')
const createDocLink = ref('/edit/')
const searchResults = ref<Document[]>([])

const clearSearch = async () => {
  //wait for the click event to finish before clearing the search
  setTimeout(() => {
    searchResults.value = []
    searchTerm.value = ''
  }, 100)
}

// watch(window.location, () => {
//   clearSearch()
// })

watch(searchTerm, (newVal) => {
  const search = escapeHtml(newVal)
  if (search.length > 3) {
    axios.get<Document[]>('/documents/search', { params: { search } })
      .then(res => {
        searchResults.value = res.data
      })
      .catch(err => {
        console.log(err)
      })
  } else {
    searchResults.value = []
  }
})
</script>

<template>
  <Disclosure as="nav" class="bg-gray-800 sm:ml-64" v-slot="{ open }">
    <div class="mx-auto px-4">
      <div class="flex items-center justify-between p-4">

        <!-- Edit options -->
        <div class="mt-5 flex lg:ml-4 lg:mt-0">
          <span class="hidden sm:block">
            <RouterLink :to="createDocLink" class="inline-flex items-center text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-semibold rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
              <PencilIcon class="-ml-0.5 mr-1.5 size-5 text-white" aria-hidden="true" />
              Create
            </RouterLink>
          </span>
        </div>

        <div class="flex items-center w-full max-w-2xl relative" style="margin-left: -5.5rem">
          <div class="hidden md:block w-full">
            <form class="max-w-md mx-auto">
              <label for="default-search" class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
              <div class="relative">
                <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                  <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                  </svg>
                </div>
                <input type="search" id="default-search" class="block w-full p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search..." v-model="searchTerm" required @blur="clearSearch" />
              </div>
            </form>
          </div>
            <ul v-if="searchResults.length > 0" class="absolute z-10 w-full mt-2  rounded-lg ring-1 ring-black/5 top-full my-4 mx-28 bg-transparent shadow-none max-w-md">
              <li v-for="doc in searchResults" :key="doc.docId" class="block p-4 text-sm text-gray-700 dark:text-white my-2 mx-4 bg-gray-700 rounded">
                <RouterLink :to="`/edit/${doc.docId}`" @click="clearSearch" class="flex justify-between" >
                  <p v-html="unescapeHtml(doc.name)" ></p>
                  <p v-html="unescapeHtml(doc.owner.username)" ></p>
                </RouterLink>
              </li>
            </ul>
        </div>
        <div class="hidden md:block">
          <div class="ml-4 flex items-center md:ml-6">
            <button type="button" class="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
              <span class="absolute -inset-1.5" />
              <span class="sr-only">View notifications</span>
              <BellIcon class="size-6" aria-hidden="true" />
            </button>

            <!-- Profile dropdown -->
            <div class="flex items-center">
              <div class="flex items-center ms-3">
                <div>
                  <button type="button" class="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600" aria-expanded="false" data-dropdown-toggle="dropdown-user">
                    <span class="sr-only">Open user menu</span>
                    <UserCircleIcon class="size-8 text-gray-400 dark:text-gray-300" aria-hidden="true" />
                  </button>
                </div>
                <div class="z-50 hidden my-4 text-base list-none bg-white divide-y divide-gray-100 rounded shadow dark:bg-gray-700 dark:divide-gray-600" id="dropdown-user">
                  <div class="px-4 py-3" role="none">
                    <p class="text-sm text-gray-900 dark:text-white" role="none" v-html="user.firstName + ' ' + user.lastName" ></p>
                    <p class="text-sm font-medium text-gray-900 truncate dark:text-gray-300" role="none" v-html="user.email" ></p>
                  </div>
                  <ul class="py-1" role="none">
                    <li>
                      <RouterLink to="/dashboard" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white" role="menuitem">Dashboard</RouterLink>
                    </li>
                    <li>
                      <RouterLink to="/profile" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white" role="menuitem">Profile</RouterLink>
                    </li>
                    <li>
                      <button @click="logout()" class="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white" role="menuitem">Sign out</button>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="-mr-2 flex md:hidden">
          <!-- Mobile menu button -->
          <DisclosureButton class="relative inline-flex items-center justify-center rounded-md bg-gray-800 p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
            <span class="absolute -inset-0.5" />
            <span class="sr-only">Open main menu</span>
            <Bars3Icon v-if="!open" class="block size-6" aria-hidden="true" />
            <XMarkIcon v-else class="block size-6" aria-hidden="true" />
          </DisclosureButton>
        </div>
      </div>
    </div>
  </Disclosure>
</template>

<style scoped>
</style>
