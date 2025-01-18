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
const model = ref<string>(document.value.content)
const docTitle = ref<string>(unescapeHtml(document.value.name))
const isSaving = ref<boolean>(false)
const inHistory = ref<boolean>(false)
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

/**
 *
 * Put the current document in the history
 * @param docId The ID of the document to put in the history
 */
async function putInHistory(docId: number): Promise<void> {
  try {
    await axios.post(`/history/${docId}`)
    inHistory.value = true
  } catch (err) {
    console.log(err)
  }
}

onMounted(() => {
  initFlowbite()
  // if (document.value.docId != -1) {
  //   axios.get<string>(`/documents/content/${document.value.docId}`)
  //     .then(res => {
  //       document.value.content = res.data
  //     })
  //     .catch(err => {
  //       console.log(err)
  //     })
  // }
})

async function saveContent(): Promise<void> {
  if (!document.value) return
  document.value.content = escapeHtml(model.value)
  try {
    isSaving.value = true
    if (document.value.docId === -1) {
      const res = await axios.post<Document>('/documents', document.value)
      isSaving.value = false
      document.value = res.data
      const content = await axios.put<string>(`/documents/content/${document.value.docId}`, model.value)
      isSaving.value = false
      document.value.content = content.data
    } else {
      const content = await axios.put<string>(`/documents/content/${document.value.docId}`, model.value)
      isSaving.value = false
      document.value.content = content.data
    }
    if (!inHistory.value) {
      await putInHistory(document.value.docId)
    }
  }catch (err) {
    isSaving.value = false
    alert('Error saving document')
    console.log(err)
  }
}

function saveTitle(): void {
  axios.put<Document>('/documents', document.value)
    .then(res => {
      isSaving.value = false
      document.value = res.data
    })
    .catch(err => {
      isSaving.value = false
      console.log(err)
    })
}


function debounce(func: () => void, delay: number) {
  let timeoutId: ReturnType<typeof setTimeout> | undefined
  return () => {
    if(timeoutId) {
      clearTimeout(timeoutId)
    }
    timeoutId = setTimeout(() => {
      func()
    }, delay)
  }
}

const debouncedSaveContent = debounce(saveContent, 1000)
const debouncedSaveTitle = debounce(saveTitle, 1000)

watch(model, () => {
  isSaving.value = true
  debouncedSaveContent()
} )
watch(docTitle, () => {
  document.value.name = escapeHtml(docTitle.value)
  if (document.value.docId != -1) {
    isSaving.value = true
    debouncedSaveTitle()
  }
})

defineExpose({
  model,
  docTitle,
  isSaving
})

</script>

<template>
  <div class="flex items-center justify-start gap-x-5 flex-wrap">
    <div class="relative z-0 max-w-80 mb-3 ml-3">
    <input type="text" id="default-input" class="block py-2.5 px-0 w-full text-lg font-semibold text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" :placeholder="docTitle" v-model="docTitle">
    <label for="default-input" class="absolute text-base text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto">Document name</label>
  </div>
    <div v-if="isSaving" class="px-3 py-1 text-xs font-medium mb-2 leading-none text-center text-blue-800 bg-blue-200 rounded-full animate-pulse dark:bg-blue-900 dark:text-blue-200">saving...</div>
    <div v-else class="px-3 py-1 text-xs font-medium mb-2 leading-none text-center text-green-800 bg-green-200 rounded-full dark:bg-green-900 dark:text-green-200">saved</div>
    <div class="flex mb-2 gap-2 items-center py-1 text-gray-600 dark:text-white">
      <i class="pi pi-crown"></i>
      <p v-if="doc.owner" >{{ doc.owner.username }}</p>
    </div>
  </div>
  <froala id="edit" :tag="'textarea'" :config="config" v-model:value="model"></froala>
</template>

<style scoped>

</style>
