<script lang="ts">
import { defineComponent, type PropType } from 'vue'
import type { Document } from '@/model/document'
import 'primeicons/primeicons.css'
import { unescapeHtml } from '../utils'

export default defineComponent({
  name: 'DocCard',
  methods: { unescapeHtml },
  props: {
    doc: { type: Object as PropType<Document>, required: true },
    shared: { type: Boolean, required: true }
  }, // Component input
  emits: ['delete', 'share']
})
</script>

<template>

   <div class="rounded bg-white dark:bg-gray-800 text-gray-200 p-5 flex-grow basis-64 max-w-64 flex flex-col justify-between">
    <h2 class="text-center text-xl font-bold mb-4">{{ unescapeHtml(doc.name) }}</h2>
    <div class="flex gap-5 items-center py-1">
      <i class="pi pi-file"></i>
      <p>{{ doc.docType }}</p>
    </div>
    <div class="flex gap-5 items-center py-1">
      <i class="pi pi-folder"></i>
      <p>{{ doc.path }}</p>
    </div>
    <div class="flex gap-5 items-center py-1">
      <i class="pi pi-calendar"></i>
      <p>{{ doc.docDate }}</p>
    </div>
    <div v-if="shared " class="flex gap-5 items-center py-1">
      <i class="pi pi-crown"></i>
      <p>{{ doc.owner.username }}</p>
    </div>
    <div class="flex gap-5 items-center justify-center pt-4 border-t mt-4 border-solid border-gray-500">
      <RouterLink :to="`/edit/${doc.docId}`" class="p-1 border-solid border-2 border-gray-300 w-9 h-9 text-center rounded hover:border-gray-400 hover:text-gray-400">
        <i class="pi pi-pen-to-square"></i>
      </RouterLink>
      <RouterLink :to="`/view/${doc.docId}`" class="p-1 border-solid border-2 border-gray-300 w-9 h-9 text-center rounded hover:border-gray-400 hover:text-gray-400">
        <i class="pi pi-eye"></i>
      </RouterLink>
      <button v-if="!shared"  class="p-1 border-solid border-2 border-gray-300 w-9 h-9 text-center rounded hover:border-gray-400 hover:text-gray-400" type="button" v-on:click="$emit('delete', doc.docId)">
        <i class="pi pi-trash"></i>
      </button>
  <button v-if="!shared" class="p-1 border-solid border-2 border-gray-300 w-9 h-9 text-center rounded hover:border-gray-400 hover:text-gray-400" type="button" v-on:click="$emit('share', doc.docId)">
    <i class="pi pi-share-alt"></i>
  </button>
    </div>
  </div>
</template>

<style scoped>
</style>
