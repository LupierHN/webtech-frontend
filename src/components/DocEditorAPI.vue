<script setup lang="ts">

import { onMounted, reactive, ref } from 'vue'
import type { Document } from '@/model/document'
import axios from 'axios'

const props = defineProps<{
  doc: Document
  title: string
}>()
const document = ref<Document>(props.doc)
onMounted(() => {
  if (document.value.docId != -1) {
    axios.get<string>(`/documents/content/${document.value.docId}`)
      .then(res => {
        document.value.content = res.data
      })
      .catch(err => {
        console.log(err)
      })
  }
})
const model = ref<string>(document.value.content)
const config =  reactive({
  events: {
    initialized: function () {
      console.log('initialized')
    }
  }
})



async function saveContent(): Promise<void> {
  //Sonderzeichen escapen
  if (!document.value) return
  document.value.content = model.value
  if (document.value.docId === -1) {
    try {
      const res = await axios.post<Document>('/documents', document.value)
      document.value = res.data
      const content = await axios.put<string>(`/documents/content/${document.value.docId}`, model.value)
      document.value.content = content.data
    } catch (err) {
      console.log(err)
    }
  }else {
    try {
      await axios.put('/documents', document.value)
    } catch (err) {
      console.log(err)
    }
  }
}

</script>

<template>
  <button v-if="document" @click="saveContent">Save</button>
  <froala id="edit" :tag="'textarea'" :config="config" v-model:value="model"></froala>
</template>

<style scoped>



</style>
