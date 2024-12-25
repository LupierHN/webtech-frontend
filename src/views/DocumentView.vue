// src/views/DashboardView.vue
<script setup lang="ts">
import { onMounted, onUpdated, ref } from 'vue'
import type { Document } from '@/model/document'
import type { User } from '@/model/user'
import axios from 'axios'
import HeaderAPI from '@/components/HeaderAPI.vue'
import SidebarAPI from '@/components/SidebarAPI.vue'
import DocEditorAPI from '@/components/DocEditorAPI.vue'
import DocViewAPI from '@/components/DocViewAPI.vue'
import { useRoute } from 'vue-router'

const document = ref<Document>()
const owner = ref<User>()
const route = useRoute()
const edit = route.name === 'edit'

onMounted(async () => {
  await loadDoc()
})
// onUpdated(async () => {
//   await loadDoc()
// })

async function loadDoc(): Promise<void> {
  const id = new URLSearchParams(window.location.search).get('id')
  if (id) {
    try {
      const res = await axios.get<Document>(`/documents/${id}`)
      const content = await axios.get<string>(`/documents/content/${id}`)
      document.value = res.data
      document.value.content = content.data
    } catch (err) {
      console.log(err)
    }
  } else if(id === null) {
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

  <button data-drawer-target="separator-sidebar" data-drawer-toggle="separator-sidebar" aria-controls="separator-sidebar" type="button" class="inline-flex items-center p-2 mt-2 ms-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600">
    <span class="sr-only">Open sidebar</span>
    <svg class="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
      <path clip-rule="evenodd" fill-rule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"></path>
    </svg>
  </button>

  <div class="p-4 sm:ml-64 overflow-y-scroll">
    <h1 class="text-2xl font-bold dark:text-white" v-if="!document">Document not found</h1>
    <div class="p-4 pl-16" v-else>
      <DocEditorAPI v-if="edit" :key="`editor-${document.docId}`" :doc="document" title="Editor"></DocEditorAPI>
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
