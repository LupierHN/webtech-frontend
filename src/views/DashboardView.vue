<script setup lang="ts">
import DocCard from '@/components/docCard.vue'
import { onMounted, ref } from 'vue'
import type { Document } from '@/model/document'
import axios from 'axios'


const apiEndpoint = import.meta.env.VITE_APP_BACKEND_BASE_URL + '/api/documents'
// const inputText = ref('')
// const inputTextarea = ref('')
const documents = ref<Document[]>([])

onMounted(() => {
  axios
    .get<Document[]>(apiEndpoint)
    .then(res => {documents.value = res.data})
    .catch(err => {console.error(err)})
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

function logError(err: unknown): void {
  alert('Something went wrong ... check your browser console for more information')
  console.error(err)
}
</script>

<template>
  <main>

    <p v-if="documents.length === 0">No documents found</p>
    <div id="document-container" v-else>
      <DocCard v-for="doc in documents" :key="doc.docId" :doc="doc" @delete="removeDoc(doc.docId)" />
    </div>
  </main>
</template>

<style scoped>

</style>
