<script setup lang="ts">
import { Disclosure, DisclosureButton } from '@headlessui/vue'
import { Bars3Icon, BellIcon, XMarkIcon, UserCircleIcon, PencilIcon } from '@heroicons/vue/24/outline'
import type { User } from '@/model/user'
import type { Notification } from '@/model/notification'
import { logout } from '@/userUtils'
import { onMounted, ref, watch } from 'vue'
import { RouterLink } from 'vue-router'
import { escapeHtml, unescapeHtml } from '@/utils'
import {
  getTimestampAsString,
  readAllNotifications,
  notifications,
  deleteNotification
} from '@/notificationUtils'
import axios from 'axios'
import type { Document } from '@/model/document'
import { initFlowbite } from 'flowbite'

const searchTerm = ref<string>('')
const createDocLink = ref('/edit/')
const searchResults = ref<Document[]>([])
const loadingData = ref<boolean>(false)

onMounted( () => {
  initFlowbite()
})

const userJSON = sessionStorage.getItem('user')
const user: User = userJSON ? JSON.parse(userJSON) : { username: '', email: '', firstName: '', lastName: '' }

const clearSearch = async () => {
  //wait for the click event to finish before clearing the search
  setTimeout(() => {
    searchResults.value = []
    searchTerm.value = ''
  }, 100)
}

watch(searchTerm, (newVal) => {
  const search = escapeHtml(newVal)
  if (search.length > 3) {
    loadingData.value = true
    axios.get<Document[]>('/documents/search', { params: { search } })
      .then(res => {
        loadingData.value = false
        searchResults.value = res.data
      })
      .catch(err => {
        loadingData.value = false
        console.log(err)
      })
  } else {
    searchResults.value = []
  }
})

watch(notifications, () => {
  console.log('Notifications updated')
})

const checkNotifications = (notifications: Notification[]) => {
  return notifications.some(notify => !notify.read)
};

</script>

<template>
  <Disclosure as="nav" class="dark:bg-gray-800 bg-gray-50 sm:ml-64 border-b border-gray-300 dark:border-none" v-slot="{ open }">
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
                <input type="search" id="default-search" class="block w-full p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search..." v-model="searchTerm" required />
                <div class="absolute inset-y-0 end-0 flex items-center pe-3 ">
                  <svg v-if="loadingData" aria-hidden="true" class="w-4 h-4 text-gray-200 animate-spin dark:text-gray-500 fill-gray-500 dark:fill-gray-200" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                  </svg>
                  <button v-else type="button" class="text-gray-500 dark:text-gray-400 hover:text-gray-200" aria-label="Clear search" @click="clearSearch">
                    <svg class="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                  </button>
                </div>
              </div>
            </form>
          </div>
            <ul v-if="searchResults.length > 0" class="absolute z-10 w-full mt-2  rounded-lg ring-1 ring-black/5 top-full my-4 mx-28 bg-gray-100 dark:bg-transparent shadow-none max-w-md">
              <li v-for="doc in searchResults" :key="doc.docId" class="block p-4 text-sm text-gray-700 dark:text-white my-2 mx-4 bg-white dark:bg-gray-700 rounded">
                <RouterLink :to="`/edit/${doc.docId}`" @click="clearSearch" class="flex justify-between" >
                  <p v-html="unescapeHtml(doc.name)" ></p>
                  <div class="flex gap-2 items-center dark:text-white">
                    <p class="">{{ doc.owner.username }}</p>
                    <i class="pi pi-crown"></i>
                  </div>
                </RouterLink>
              </li>
            </ul>
        </div>
        <div class="hidden md:block">
          <div class="ml-4 flex items-center md:ml-6">
            <!-- Notification button -->
            <button id="dropdownNotificationButton" @click="readAllNotifications" data-dropdown-toggle="dropdownNotification" class="relative inline-flex items-center text-sm font-medium text-center text-gray-500 hover:text-gray-900 focus:outline-none dark:hover:text-white dark:text-gray-400" type="button">
              <BellIcon class="size-6" aria-hidden="true" ></BellIcon>
              <div v-if="notifications.length > 0 && checkNotifications(notifications)" class="absolute block w-3 h-3 bg-red-500 border-2 border-white rounded-full -top-0.5 start-2.5 dark:border-gray-900"></div>
            </button>
            <!-- Dropdown menu -->
            <div id="dropdownNotification" class="z-20 hidden w-full max-w-sm bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 dark:divide-gray-500" aria-labelledby="dropdownNotificationButton">
              <div class="block px-4 py-2 font-medium text-center text-gray-600 rounded-t-lg bg-gray-50 dark:bg-gray-700 dark:text-white">
                Notifications
              </div>
              <div class="divide-y divide-gray-100 dark:divide-gray-700">
                <RouterLink :to="`/edit/${notify.document.docId}`" @click="deleteNotification(notify)" v-for="notify in notifications" :key="notify.nId" class="flex px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-800">
                  <div class="flex-shrink-0">
                    <UserCircleIcon class="w-11 h-11 text-gray-500 dark:text-gray-300" aria-hidden="true" />
                  </div>
                  <div class="w-full ps-3">
                    <div class="text-gray-500 text-sm mb-1.5 dark:text-gray-300" v-html="notify.message"></div>
                    <div class="text-xs text-blue-600 dark:text-blue-500" v-html="getTimestampAsString(notify.timestamp)" ></div>
                  </div>
                </RouterLink>
              </div>
              <RouterLink to="/shared/with-me" @click="deleteNotification(null)" class="block py-2 text-sm font-medium text-center text-gray-900 rounded-b-lg bg-gray-50 hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white">
                <div class="inline-flex items-center ">
                  <svg class="w-4 h-4 me-2 text-gray-500 dark:text-gray-300" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 14">
                    <path d="M10 0C4.612 0 0 5.336 0 7c0 1.742 3.546 7 10 7 6.454 0 10-5.258 10-7 0-1.664-4.612-7-10-7Zm0 10a3 3 0 1 1 0-6 3 3 0 0 1 0 6Z"/>
                  </svg>
                  View all
                </div>
              </RouterLink>
            </div>

            <!-- Profile dropdown -->
            <div class="flex items-center">
              <div class="flex items-center ms-3">
                <div>
                  <button type="button" class="flex text-sm rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600" aria-expanded="false" data-dropdown-toggle="dropdown-user">
                    <span class="sr-only">Open user menu</span>
                    <UserCircleIcon class="size-8 text-gray-700 dark:text-gray-300" aria-hidden="true" />
                  </button>
                </div>
                <div class="z-50 hidden my-4 text-base list-none bg-white divide-y divide-gray-100 rounded shadow dark:bg-gray-700 dark:divide-gray-600" id="dropdown-user">
                  <div class="px-4 py-3" role="none" :key="user.username" v-if="user" >
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
          <DisclosureButton class="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
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
