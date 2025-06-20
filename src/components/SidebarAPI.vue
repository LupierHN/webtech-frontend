<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { ChartPieIcon, FolderIcon, BookOpenIcon, UsersIcon, DocumentArrowUpIcon, ShareIcon } from '@heroicons/vue/24/solid'
import { initFlowbite } from 'flowbite'
import axios from 'axios'
import type { HistoryElement } from '@/model/historyElement'
import { PencilIcon } from '@heroicons/vue/24/outline'

const openDocs = ref<HistoryElement[]>([])
const createDocLink = ref('/edit/')

/**
 * This function removes a document from the list of open documents
 * @param id
 */
async function removeHistElement(id: number): Promise<void> {
  try {
    await axios.delete(`/history/${id}`)
    openDocs.value = openDocs.value.filter(hist => hist.histId !== id)
  }catch (err) {
    console.error(err)
  }
}

/**
 * Fetches the open documents from the server
 */
async function fetchOpenDocs(): Promise<void> {
  try {
    const res = await axios.get<HistoryElement[]>('/history')
    openDocs.value = res.data
  } catch (err) {
    console.error(err)
  }
}

onMounted( async () => {
  await fetchOpenDocs()
  initFlowbite()
})

</script>

<template>

  <aside id="separator-sidebar" class="fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0 border-r dark:border-none border-gray-300" aria-label="Sidebar">
    <div class="h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800">
      <RouterLink to="/dashboard">
        <div class="flex justify-center pb-4">
          <div class="w-12 h-12 dark:bg-[url('/src/assets/logo.png')] bg-[url('/src/assets/dark-logo.png')] bg-contain"> </div>
          <h1 class="text-gray-800 dark:text-white font-bold content-center text-xl">BlubbDocs</h1>
        </div>
      </RouterLink>
      <div class="flex items-center justify-center mt-3 mx-auto mb-4">
        <span class="xl:hidden block">
            <RouterLink :to="createDocLink" class="inline-flex items-center text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-semibold rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
              <PencilIcon class="-ml-0.5 mr-1.5 size-5 text-white" aria-hidden="true" />
              Create
            </RouterLink>
        </span>
      </div>
      <ul class="space-y-2 font-medium">
<!--    Dashboard-->
        <li>
          <RouterLink class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 group" to="/dashboard">
            <ChartPieIcon class="size-6 text-gray-400" ></ChartPieIcon>
            <span class="ms-3">Dashboard</span>
          </RouterLink>
        </li>
<!--    Directories-->
        <li>
          <a class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white group select-none">
            <FolderIcon class="size-6 text-gray-400" ></FolderIcon>
            <span class="flex-1 ms-3 whitespace-nowrap">Directories</span>
            <span class="inline-flex items-center justify-center px-2 ms-3 text-sm font-medium text-gray-800 bg-gray-100 rounded-full dark:bg-gray-700 dark:text-gray-300">Pro</span>
          </a>
        </li>
<!--    Open Documents-->
        <li v-if="openDocs.length === 0">
          <a class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white group select-none">
            <BookOpenIcon class="size-6 text-gray-400" ></BookOpenIcon>
            <span class="flex-1 ms-3 whitespace-nowrap">Open Documents</span>
            <span class="inline-flex items-center justify-center w-3 h-3 ms-3 text-sm font-medium text-gray-800 bg-gray-100 rounded-full dark:bg-gray-700 dark:text-gray-300 p-3">0</span>
          </a>
        </li>
        <li v-else>
          <button type="button" class="flex items-center w-full p-2 text-base text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700" aria-controls="dropdown-example" data-collapse-toggle="dropdown-example">
            <BookOpenIcon class="size-6 text-gray-400" ></BookOpenIcon>
            <span class="flex-1 ms-3 text-left rtl:text-right whitespace-nowrap">Open Documents</span>
            <svg class="w-3 h-3 mr-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4"/>
            </svg>
          </button>
          <ul id="dropdown-example" class="hidden py-2 space-y-2">
            <li v-for="hist in openDocs" :key="hist.histId" class="flex group group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700 rounded-lg text-gray-900 transition duration-75 p-2 pl-0">
              <RouterLink :to="`/edit/${hist.document.docId}`" class="flex items-center w-full pl-11 mr-1">
                {{ hist.document.name }}
              </RouterLink>
              <button @click="removeHistElement(hist.histId)" class="ms-auto text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-gray-100 mr-2">
                <svg class="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </li>
          </ul>
        </li>
<!--    Users-->
        <li>
          <a class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white group select-none">
            <UsersIcon class="size-6 text-gray-400" ></UsersIcon>
            <span class="flex-1 ms-3 whitespace-nowrap">Users</span>
            <span class="inline-flex items-center justify-center px-2 ms-3 text-sm font-medium text-gray-800 bg-gray-100 rounded-full dark:bg-gray-700 dark:text-gray-300">Pro</span>
          </a>
        </li>
<!--    Shared with Me-->
        <li>
          <RouterLink to="/shared/with-me" class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 group">
            <ShareIcon class="size-6 text-gray-400" ></ShareIcon>
            <span class="ms-3">Shared with Me</span>
          </RouterLink>
        </li>
<!--    Shared by Me-->
        <li>
          <RouterLink to="/shared/by-me" class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 group">
            <DocumentArrowUpIcon class="size-6 text-gray-400" ></DocumentArrowUpIcon>
            <span class="ms-3">Shared by Me</span>
          </RouterLink>
        </li>
<!--        <li>-->
<!--          <a href="#" class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">-->
<!--            <svg class="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">-->
<!--              <path d="M5 5V.13a2.96 2.96 0 0 0-1.293.749L.879 3.707A2.96 2.96 0 0 0 .13 5H5Z"/>-->
<!--              <path d="M6.737 11.061a2.961 2.961 0 0 1 .81-1.515l6.117-6.116A4.839 4.839 0 0 1 16 2.141V2a1.97 1.97 0 0 0-1.933-2H7v5a2 2 0 0 1-2 2H0v11a1.969 1.969 0 0 0 1.933 2h12.134A1.97 1.97 0 0 0 16 18v-3.093l-1.546 1.546c-.413.413-.94.695-1.513.81l-3.4.679a2.947 2.947 0 0 1-1.85-.227 2.96 2.96 0 0 1-1.635-3.257l.681-3.397Z"/>-->
<!--              <path d="M8.961 16a.93.93 0 0 0 .189-.019l3.4-.679a.961.961 0 0 0 .49-.263l6.118-6.117a2.884 2.884 0 0 0-4.079-4.078l-6.117 6.117a.96.96 0 0 0-.263.491l-.679 3.4A.961.961 0 0 0 8.961 16Zm7.477-9.8a.958.958 0 0 1 .68-.281.961.961 0 0 1 .682 1.644l-.315.315-1.36-1.36.313-.318Zm-5.911 5.911 4.236-4.236 1.359 1.359-4.236 4.237-1.7.339.341-1.699Z"/>-->
<!--            </svg>-->
<!--            <span class="flex-1 ms-3 whitespace-nowrap">Sign Up</span>-->
<!--          </a>-->
<!--        </li>-->
<!--      </ul>-->
<!--      <ul class="pt-4 mt-4 space-y-2 font-medium border-t border-gray-200 dark:border-gray-700">-->
<!--        <li>-->
<!--          <a href="#" class="flex items-center p-2 text-gray-900 transition duration-75 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white group">-->
<!--            <svg class="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 17 20">-->
<!--              <path d="M7.958 19.393a7.7 7.7 0 0 1-6.715-3.439c-2.868-4.832 0-9.376.944-10.654l.091-.122a3.286 3.286 0 0 0 .765-3.288A1 1 0 0 1 4.6.8c.133.1.313.212.525.347A10.451 10.451 0 0 1 10.6 9.3c.5-1.06.772-2.213.8-3.385a1 1 0 0 1 1.592-.758c1.636 1.205 4.638 6.081 2.019 10.441a8.177 8.177 0 0 1-7.053 3.795Z"/>-->
<!--            </svg>-->
<!--            <span class="ms-3">Upgrade to Pro</span>-->
<!--          </a>-->
<!--        </li>-->
<!--        <li>-->
<!--          <a href="#" class="flex items-center p-2 text-gray-900 transition duration-75 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white group">-->
<!--            <svg class="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 20">-->
<!--              <path d="M16 14V2a2 2 0 0 0-2-2H2a2 2 0 0 0-2 2v15a3 3 0 0 0 3 3h12a1 1 0 0 0 0-2h-1v-2a2 2 0 0 0 2-2ZM4 2h2v12H4V2Zm8 16H3a1 1 0 0 1 0-2h9v2Z"/>-->
<!--            </svg>-->
<!--            <span class="ms-3">Documentation</span>-->
<!--          </a>-->
<!--        </li>-->
<!--        <li>-->
<!--          <a href="#" class="flex items-center p-2 text-gray-900 transition duration-75 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white group">-->
<!--            <svg class="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">-->
<!--              <path d="M18 0H6a2 2 0 0 0-2 2h14v12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Z"/>-->
<!--              <path d="M14 4H2a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2ZM2 16v-6h12v6H2Z"/>-->
<!--            </svg>-->
<!--            <span class="ms-3">Components</span>-->
<!--          </a>-->
<!--        </li>-->
<!--        <li>-->
<!--          <a href="#" class="flex items-center p-2 text-gray-900 transition duration-75 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white group">-->
<!--            <svg class="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 21 21">-->
<!--              <path d="m5.4 2.736 3.429 3.429A5.046 5.046 0 0 1 10.134 6c.356.01.71.06 1.056.147l3.41-3.412c.136-.133.287-.248.45-.344A9.889 9.889 0 0 0 10.269 1c-1.87-.041-3.713.44-5.322 1.392a2.3 2.3 0 0 1 .454.344Zm11.45 1.54-.126-.127a.5.5 0 0 0-.706 0l-2.932 2.932c.029.023.049.054.078.077.236.194.454.41.65.645.034.038.078.067.11.107l2.927-2.927a.5.5 0 0 0 0-.707Zm-2.931 9.81c-.024.03-.057.052-.081.082a4.963 4.963 0 0 1-.633.639c-.041.036-.072.083-.115.117l2.927 2.927a.5.5 0 0 0 .707 0l.127-.127a.5.5 0 0 0 0-.707l-2.932-2.931Zm-1.442-4.763a3.036 3.036 0 0 0-1.383-1.1l-.012-.007a2.955 2.955 0 0 0-1-.213H10a2.964 2.964 0 0 0-2.122.893c-.285.29-.509.634-.657 1.013l-.01.016a2.96 2.96 0 0 0-.21 1 2.99 2.99 0 0 0 .489 1.716c.009.014.022.026.032.04a3.04 3.04 0 0 0 1.384 1.1l.012.007c.318.129.657.2 1 .213.392.015.784-.05 1.15-.192.012-.005.02-.013.033-.018a3.011 3.011 0 0 0 1.676-1.7v-.007a2.89 2.89 0 0 0 0-2.207 2.868 2.868 0 0 0-.27-.515c-.007-.012-.02-.025-.03-.039Zm6.137-3.373a2.53 2.53 0 0 1-.35.447L14.84 9.823c.112.428.166.869.16 1.311-.01.356-.06.709-.147 1.054l3.413 3.412c.132.134.249.283.347.444A9.88 9.88 0 0 0 20 11.269a9.912 9.912 0 0 0-1.386-5.319ZM14.6 19.264l-3.421-3.421c-.385.1-.781.152-1.18.157h-.134c-.356-.01-.71-.06-1.056-.147l-3.41 3.412a2.503 2.503 0 0 1-.443.347A9.884 9.884 0 0 0 9.732 21H10a9.9 9.9 0 0 0 5.044-1.388 2.519 2.519 0 0 1-.444-.348ZM1.735 15.6l3.426-3.426a4.608 4.608 0 0 1-.013-2.367L1.735 6.4a2.507 2.507 0 0 1-.35-.447 9.889 9.889 0 0 0 0 10.1c.1-.164.217-.316.35-.453Zm5.101-.758a4.957 4.957 0 0 1-.651-.645c-.033-.038-.077-.067-.11-.107L3.15 17.017a.5.5 0 0 0 0 .707l.127.127a.5.5 0 0 0 .706 0l2.932-2.933c-.03-.018-.05-.053-.078-.076ZM6.08 7.914c.03-.037.07-.063.1-.1.183-.22.384-.423.6-.609.047-.04.082-.092.129-.13L3.983 4.149a.5.5 0 0 0-.707 0l-.127.127a.5.5 0 0 0 0 .707L6.08 7.914Z"/>-->
<!--            </svg>-->
<!--            <span class="ms-3">Help</span>-->
<!--          </a>-->
<!--        </li>-->
      </ul>
    </div>
  </aside>
</template>

<style scoped>

</style>
