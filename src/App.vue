<script setup lang="ts">
import { RouterView } from 'vue-router'
import '@/assets/output.css'
import { onMounted, onUpdated } from 'vue'
import { checkTokens } from '@/tokenUtils'


onMounted(() => {
  checkTokens()
})
onUpdated(() => {
  checkTokens()
})

</script>

<template>
  <RouterView />
</template>
