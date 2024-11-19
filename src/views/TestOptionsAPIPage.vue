<script lang="ts">
import { defineComponent } from 'vue'
import TestOptionsAPI from '@/components/TestOptionsAPI.vue'

export default defineComponent({
  name: 'TestOptionsAPIPage',
  components: { TestOptionsAPI }
})
</script>

<template>
  <main>
    <TestOptionsAPI title="Test List (Options API)"></TestOptionsAPI>
  </main>
</template>

<style scoped>

</style>
