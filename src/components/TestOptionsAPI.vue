<script lang="ts">
import {defineComponent} from 'vue'

export default defineComponent({
  name: "TestOptionsAPI",
  props: ['title'],
  methods: {
    sayHello() {
      console.log('Hello')
    }
  }
})
</script>

<template>
  <div>
    <h1>{{ title }}</h1>
    <button @click="sayHello">Say Hello</button>
  </div>
</template>

<style scoped>

</style>
