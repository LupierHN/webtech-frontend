<script setup lang="ts">
import { onMounted, ref } from 'vue'

defineProps<{ title: string }>()

let input = ref('das ist ein input')
const obj = ref([])

function someMethod() {
  console.log('someMethod')
}
function saveObj() {
  obj.value.push(input.value)
}

onMounted(() => {
})
</script>

<template>
  <h1>{{ title }}</h1>
  <p> this component has been...</p>
  <button @click="someMethod()">Click me</button>
  <input v-model="input" />
  <button @click="saveObj()">Save</button>

  <p v-if="obj.length === 0">No items</p>
  <ul v-else>
    <li v-for="item in obj" v-bind:key="item">{{ item }}</li>
  </ul>

</template>

<style scoped>

</style>
