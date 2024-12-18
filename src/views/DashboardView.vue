// src/views/DashboardView.vue
<script setup lang="ts">
import DocCard from '@/components/docCard.vue'
import { nextTick, onMounted, ref } from 'vue'
import type { Document } from '@/model/document'
import axios from 'axios'
import { logError, renewToken, validateToken } from '@/utils'
import HeaderAPI from '@/components/HeaderAPI.vue'
import SidebarAPI from '@/components/SidebarAPI.vue'
import router from '@/router'

const apiEndpoint = import.meta.env.VITE_APP_BACKEND_BASE_URL + '/api/documents'
const documents = ref<Document[]>([])

onMounted(async () => {
  try {
    const res = await axios.get<Document[]>(apiEndpoint + '/all', { headers: { Authorization: 'Bearer ' + localStorage.getItem('accessToken') } })
    documents.value = res.data
  } catch (err: any) {
    if (err.response && err.response.status === 401) {
      if (await renewToken() && await validateToken()) {
        console.log('Token renewed')
        try {
          const res = await axios.get<Document[]>(apiEndpoint + '/all', { headers: { Authorization: 'Bearer ' + localStorage.getItem('accessToken') } })
          documents.value = res.data
        } catch (err: any) {
          console.log('Token renewed but still unauthorized')
          await nextTick(() => {
            router.push('/login')
          })
        }
      } else {
        await nextTick(() => {
          router.push('/login')
        })
      }
    } else {
      console.log('Token is invalid')
    }
  }
})



async function removeDoc(id: number): Promise<void> {
  try {
    const response = await axios.delete(`${apiEndpoint}/${id}`)
    console.log(response)
    documents.value = documents.value.filter(doc => doc.docId !== id)
  } catch (err) {
    logError(err)
  }
}

// onMounted(() => {
//   localStorage.clear()
// })

// function nextID() {
//   let id = 0
//   for (let i = 0; i < documents.value.length; i++) {
//     if (documents.value[i].docId > id) {
//       id = documents.value[i].docId
//     }
//   }
//   return id + 1
// }

// function addDoc(title: string, content: string): void {
//   axios
//     .post<Document>(apiEndpoint, { docId: nextID(), title: title, content: content })
//     .then(res => {
//       inputText.value = ''
//       inputTextarea.value = ''
//       documents.value.push(res.data)
//     })
//     .catch(err => logError(err))
// }

</script>

<template>
  <HeaderAPI title="Header"></HeaderAPI>
  <SidebarAPI title="Sidebar"></SidebarAPI>

  <button data-drawer-target="separator-sidebar" data-drawer-toggle="separator-sidebar" aria-controls="separator-sidebar" type="button" class="inline-flex items-center p-2 mt-2 ms-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600">
    <span class="sr-only">Open sidebar</span>
    <svg class="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
      <path clip-rule="evenodd" fill-rule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"></path>
    </svg>
  </button>

  <div class="p-4 sm:ml-64">
    <div class="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700">
      <p v-if="documents.length === 0">No documents found</p>
      <div class="grid grid-cols-5 gap-4 mb-4 justify-center" v-else>
        <DocCard v-for="doc in documents" :key="doc.docId" :doc="doc" @delete="removeDoc(doc.docId)" />
      </div>
    </div>
  </div>


  <!--  <main>-->

<!--    <p v-if="documents.length === 0">No documents found</p>-->
<!--    <div id="document-container" v-else>-->
<!--      <DocCard v-for="doc in documents" :key="doc.docId" :doc="doc" @delete="removeDoc(doc.docId)" />-->
<!--    </div>-->
<!--  </main>-->
</template>

<style scoped>

</style>
