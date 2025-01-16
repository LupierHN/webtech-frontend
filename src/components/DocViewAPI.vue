<script setup lang="ts">
import { ref } from 'vue'
import type { Document } from '@/model/document'
import { unescapeHtml } from '@/utils'

const props = defineProps<{
  doc: Document
  title: string
}>()

const document = ref<Document>(props.doc)

const docTitle = ref<string>(unescapeHtml(document.value.name))
</script>

<template>
  <h1 class="text-black dark:text-white font-bold text-2xl mb-4" v-html="docTitle"></h1>
  <div class="fr-view bg-white px-12 py-1 rounded" v-html="document.content"></div>

</template>

<style scoped>
</style>
