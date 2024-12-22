<script setup lang="ts">
import { RouterView } from 'vue-router'
import '@/assets/output.css'
import { onMounted, onUpdated } from 'vue'
import { checkTokens } from '@/tokenUtils'
import { initFlowbite } from 'flowbite'


onMounted(() => {
  initFlowbite()
  checkTokens()
})
onUpdated(() => {
  checkTokens()
})

</script>

<template>
  <div class="w-dvw h-dvh bg-gray-50 dark:bg-gray-900">
    <RouterView />
  </div>
</template>
