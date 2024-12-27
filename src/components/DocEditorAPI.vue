<script setup lang="ts">
import { onMounted, reactive, ref, watch } from 'vue'
import type { Document } from '@/model/document'
import axios from 'axios'
import { escapeHtml, unescapeHtml } from '@/utils'

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
  <input type="text" id="default-input" class="text-black dark:text-white font-bold text-2xl mb-4 border-none bg-transparent" :placeholder="docTitle" v-model="docTitle">
  <froala id="edit" :tag="'textarea'" :config="config" v-model:value="model"></froala>
</template>

<style scoped>

</style>
