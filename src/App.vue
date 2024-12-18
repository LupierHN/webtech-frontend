<script setup lang="ts">
import { RouterView } from 'vue-router'
import '@/assets/output.css'
import { onMounted, onUpdated } from 'vue'
import { checkTokens } from '@/utils'


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
