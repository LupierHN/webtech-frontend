<script lang="ts">
import { defineComponent, type PropType } from 'vue'
import type { Document } from '@/model/document'

export default defineComponent({
    name: 'DocCard',
    props: { doc: { type: Object as PropType<Document>, required: true } }, // Component input
    emits: ['delete'], // Component output
})
</script>

<template>
  <div class="h-24 rounded bg-gray-50 dark:bg-gray-800">
    <p >{{ doc }}</p>
    <button :aria-description="'Delete Document ' + doc" v-on:click="$emit('delete')">DELETE</button>
  </div>

<!--  <h1>Dokumentenliste</h1>-->
<!--  <ul>-->
<!--    <li v-for="doc in documents" :key="doc.docId">-->
<!--      <h2>{{ doc.name }}</h2>-->
<!--      <p>{{ doc.content }}</p>-->
<!--&lt;!&ndash;      <pre>{{doc.id}}</pre>&ndash;&gt;-->
<!--      <button @click="removeDoc(doc.docId)">Remove</button>-->
<!--    </li>-->
<!--  </ul>-->
<!--  <h1>Neues Dokument</h1>-->
<!--  <input v-model="inputText" type="text" placeholder="Titel" />-->
<!--  <textarea v-model="inputTextarea" placeholder="Inhalt"></textarea>-->
<!--  <button @click="addDoc(inputText, inputTextarea)">Add</button>-->
</template>

<style scoped>

</style>
