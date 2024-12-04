<script setup lang="ts">
import { ref} from 'vue'

let doclist = ref([
  { id: 1, title: 'WebTech-VL-5', content: 'WebTech-VL-5 Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam' },
  { id: 2, title: 'Controlling TKR', content: 'Controlling TKR Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam' },
  { id: 3, title: 'DB-Tech JDBC', content: 'DB-Tech JDBC Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam' },
  { id: 4, title: 'Statistik Lorenzkurve', content: 'Statistik Lorenzkurve Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam' },
  { id: 5, title: 'Prog2 JUnit', content: 'Content of Prog2 JUnit Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam' },
])

let inputText = ref('')
let inputTextarea = ref('')

function removeDoc(id: number) {
  doclist.value = doclist.value.filter(doc => doc.id !== id)
}
function nextID() {
  let id = 0
  for (let i = 0; i < doclist.value.length; i++) {
    if (doclist.value[i].id > id) {
      id = doclist.value[i].id
    }
  }
  return id + 1
}

function addDoc(title: string, content: string) {
  doclist.value.push({
    id: nextID(),
    title,
    content
  })
}

</script>
<template>
  <h1>Dokumentenliste</h1>
  <ul>
    <li v-for="doc in doclist" :key="doc.id">
      <h2>{{ doc.title }}</h2>
      <p>{{ doc.content }}</p>
<!--      <pre>{{doc.id}}</pre>-->
      <button @click="removeDoc(doc.id)">Remove</button>
    </li>
  </ul>
  <h1>Neues Dokument</h1>
  <input v-model="inputText" type="text" placeholder="Titel" />
  <textarea v-model="inputTextarea" placeholder="Inhalt"></textarea>
  <button @click="addDoc(inputText, inputTextarea)">Add</button>
</template>

<style scoped>

</style>
