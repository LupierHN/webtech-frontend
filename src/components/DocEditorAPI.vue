<script setup lang="ts">
import { onMounted, reactive, ref, watch } from 'vue'
import type { Document } from '@/model/document'
import axios from 'axios'
import { escapeHtml, unescapeHtml } from '@/utils'
import { initFlowbite } from 'flowbite'

const props = defineProps<{
  doc: Document
  title: string
}>()
const document = ref<Document>(props.doc)
onMounted(() => {
  initFlowbite()
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
const docTitle = ref<string>(unescapeHtml(document.value.name))
const config =  reactive({
  toolbarButtons: {
    moreText: {
      buttons: ['bold', 'italic', 'underline', 'strikeThrough', 'subscript', 'superscript', 'paragraphFormat', 'fontFamily', 'fontSize', 'textColor', 'backgroundColor', 'inlineClass', 'inlineStyle', 'clearFormatting']
    },
    moreParagraph: {
      buttons: ['alignLeft', 'alignCenter', 'formatOLSimple', 'alignRight', 'alignJustify', 'formatOL', 'formatUL', 'paragraphStyle', 'lineHeight']
    },
    moreRich: {
      buttons: ['insertLink', 'insertTable', 'emoticons', 'specialCharacters', 'embedly', 'insertHR']
    },
    moreMisc: {
      buttons: ['undo', 'redo', 'fullscreen', 'print', 'getPDF', 'selectAll', 'html', 'help']
    }
  },
  quickInsertButtons: ['table', 'ul', 'ol', 'hr'],
  autofocus: true,
  heightMin: 400
})

async function saveContent(): Promise<void> {
  if (!document.value) return
  document.value.content = escapeHtml(model.value)
  try {
    if (document.value.docId === -1) {
      const res = await axios.post<Document>('/documents', document.value)
      document.value = res.data
      const content = await axios.put<string>(`/documents/content/${document.value.docId}`, model.value)
      document.value.content = content.data
    } else {
      const content = await axios.put<string>(`/documents/content/${document.value.docId}`, model.value)
      document.value.content = content.data
    }
  }catch (err) {
    console.log(err)
  }
}

watch(model, () => {
  saveContent()
} )
watch(docTitle, () => {
  document.value.name = escapeHtml(docTitle.value)
  if (document.value.docId != -1) {
    axios.put<Document>('/documents', document.value)
      .then(res => {
        document.value = res.data
      })
      .catch(err => {
        console.log(err)
      })
  }
})

</script>

<template>
  <div class="relative z-0 max-w-80 mb-3 ml-3">
    <input type="text" id="default-input" class="block py-2.5 px-0 w-full text-lg font-semibold text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" :placeholder="docTitle" v-model="docTitle">
    <label for="default-input" class="absolute text-base text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto">Document name</label>
  </div>
  <froala id="edit" :tag="'textarea'" :config="config" v-model:value="model"></froala>
</template>

<style scoped>

</style>
