<script setup lang="ts">
import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'
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

const navigation = [
  { name: 'Dashboard', href: '#', current: true },
  { name: 'Team', href: '#', current: false },
  { name: 'Projects', href: '#', current: false },
  { name: 'Calendar', href: '#', current: false },
  { name: 'Reports', href: '#', current: false },
]
const userNavigation = [
  { name: 'Your Profile', href: '#' },
  { name: 'Settings', href: '#' },
  { name: 'Sign out', href: '#' },
]
const searchTerm = ref<string>('')
const createDocLink = ref('/edit/')
const searchResults = ref<Document[]>([])

const clearSearch = () => {
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
                <RouterLink :to="`/edit/${doc.docId}`" >{{ unescapeHtml(doc.name) }}</RouterLink>
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
            <Menu as="div" class="relative ml-3">
              <div>
                <MenuButton class="relative flex max-w-xs items-center rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                  <span class="absolute -inset-1.5" />
                  <span class="sr-only">Open user menu</span>
                  <UserCircleIcon class="size-10 rounded-full text-gray-900 dark:text-white" />
                </MenuButton>
              </div>
              <transition enter-active-class="transition ease-out duration-100" enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100" leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100" leave-to-class="transform opacity-0 scale-95">
                <MenuItems class="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 focus:outline-none">
                  <MenuItem v-slot="{ active }">
                    <RouterLink to="/profile" :class="[active ? 'bg-gray-100 outline-none' : '', 'block px-4 py-2 text-sm text-gray-700']">Profile</RouterLink>
                  </MenuItem>
                  <MenuItem v-slot="{ active }">
                    <RouterLink to="/settings" :class="[active ? 'bg-gray-100 outline-none' : '', 'block px-4 py-2 text-sm text-gray-700']">Settings</RouterLink>
                  </MenuItem>
                  <MenuItem v-slot="{ active }">
                    <button @click="logout" :class="[active ? 'bg-gray-100 outline-none' : '', 'block px-4 py-2 text-sm text-gray-700 w-full text-left']">Sign out</button>
                  </MenuItem>
                </MenuItems>
              </transition>
            </Menu>
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

    <DisclosurePanel class="md:hidden">
      <div class="space-y-1 px-2 pb-3 pt-2 sm:px-3">
        <DisclosureButton v-for="item in navigation" :key="item.name" as="a" :href="item.href" :class="[item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white', 'block rounded-md px-3 py-2 text-base font-medium']" :aria-current="item.current ? 'page' : undefined">{{ item.name }}</DisclosureButton>
      </div>
      <div class="border-t border-gray-700 pb-3 pt-4">
        <div class="flex items-center px-5">
          <div class="shrink-0">
            <UserCircleIcon class="size-10 rounded-full" />
          </div>
          <div class="ml-3">
            <div class="text-base/5 font-medium text-white">{{ user.username }}</div>
            <div class="text-sm font-medium text-gray-400">{{ user.email }}</div>
          </div>
          <button type="button" class="relative ml-auto shrink-0 rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
            <span class="absolute -inset-1.5" />
            <span class="sr-only">View notifications</span>
            <BellIcon class="size-6" aria-hidden="true" />
          </button>
        </div>
        <div class="mt-3 space-y-1 px-2">
          <DisclosureButton v-for="item in userNavigation" :key="item.name" as="a" :href="item.href" class="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white">{{ item.name }}</DisclosureButton>
        </div>
      </div>
    </DisclosurePanel>
  </Disclosure>
</template>

<style scoped>
</style>
