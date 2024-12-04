<script setup lang="ts">
  import { ref} from 'vue'

  //temporary data for testing
  let openDocs = ref([
    { hID: 1, title: 'WebTech-VL-5' },
    { hID: 2, title: 'Controlling TKR' },
    { hID: 3, title: 'DB-Tech JDBC' },
    { hID: 4, title: 'Statistik Lorenzkurve' },
    { hID: 5, title: 'Prog2 JUnit' }
  ])

  // This function removes a document from the list of open documents
  function removeDoc(hID: number) {
    openDocs.value = openDocs.value.filter(doc => doc.hID !== hID)
  }

</script>

<template>
  <h1>Offene Dokumente</h1>
  <ul>
    <li v-for="doc in openDocs" :key="doc.hID">
      <h2>{{ doc.title }}</h2>
      <button @click="removeDoc(doc.hID)">Remove</button>
    </li>
  </ul>
</template>

<style scoped>

</style>
