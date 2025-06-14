// src/views/DashboardView.vue
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import type { Document } from '@/model/document'
import type { User } from '@/model/user'
import axios from 'axios'
import HeaderAPI from '@/components/HeaderAPI.vue'
import SidebarAPI from '@/components/SidebarAPI.vue'
import DocEditorAPI from '@/components/DocEditorAPI.vue'
import DocViewAPI from '@/components/DocViewAPI.vue'
import { onBeforeRouteUpdate, useRoute } from 'vue-router'

const document = ref<Document>()
const owner = ref<User>()
const route = useRoute()
const edit = route.name === 'edit'
const loadingData = ref<boolean>(false)

onMounted(async () => {
    if (route.params.id) {
    await loadDoc(+route.params.id)
  } else {
    await loadDoc()
  }
})
onBeforeRouteUpdate(async (to, from) => {
  if (from.name === 'dashboard') {
  }
  if (!to.params.id) {
    return {name: 'dashboard'}
  }else {
    await loadDoc(+to.params.id)
  }
})

async function loadDoc(id?: number): Promise<void> {
  if (id !== undefined) {
    try {
      loadingData.value = true
      const res = await axios.get<Document>(`/documents/${id}`)
      const content = await axios.get<string>(`/documents/content/${id}`)
      loadingData.value = false
      document.value = res.data
      document.value.content = content.data
    } catch (err) {
      loadingData.value = false
      console.log(err)
    }
  } else {
    owner.value = JSON.parse(sessionStorage.getItem('user') || '{}')
    if (owner.value) {
      document.value = {
        docId: -1,
        name: 'New Document',
        docType: 'text',
        path: '',
        content: '',
        owner: owner.value,
        docDate: ''
      }
    }else {
      document.value = undefined
    }
  }
}


</script>

<template>
  <HeaderAPI title="Header"></HeaderAPI>
  <SidebarAPI title="Sidebar"></SidebarAPI>

  <div class="p-4 sm:ml-64 overflow-y-scroll">
    <div class="p-4 pl-16">
      <div v-if="loadingData" class="relative mx-auto items-center block max-w-64 p-6 bg-white border border-gray-100 rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-800 dark:hover:bg-gray-700">
        <h2 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white opacity-20">Your document is loading</h2>
        <p class="font-normal text-gray-700 dark:text-gray-400 opacity-20">Please wait a moment while we load your document</p>
        <div role="status" class="absolute -translate-x-1/2 -translate-y-1/2 top-2/4 left-1/2">
          <svg aria-hidden="true" class="w-8 h-8 text-gray-200 animate-spin dark:text-gray-500 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/><path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/></svg>
          <span class="sr-only">Loading...</span>
        </div>
      </div>
      <h1 v-else-if="!document" class="text-2xl font-bold dark:text-white">Document not found</h1>
      <DocEditorAPI v-else-if="edit" :key="`editor-${document.docId}`" :doc="document" title="Editor"></DocEditorAPI>
      <DocViewAPI v-else :key="`view-${document.docId}`" :doc="document" title="View"></DocViewAPI>
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
