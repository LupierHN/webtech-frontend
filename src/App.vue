<script setup lang="ts">
import { RouterView, useRouter, useRoute} from 'vue-router'
import '@/assets/output.css'
import { onMounted, onUpdated } from 'vue'
import { checkTokens } from '@/tokenUtils'
import { initFlowbite } from 'flowbite'

const router = useRouter()
const route = useRoute()

onMounted(() => {
  if (router.currentRoute.value.path === '/') {
    router.push({ name: 'dashboard' })
  }
  initFlowbite()
  checkTokens()
})
onUpdated(() => {
  if (router.currentRoute.value.path === '/') {
    router.push({ name: 'dashboard' })
  }
  checkTokens()
})

</script>

<template>
  <div class="min-w-dvw min-h-dvh bg-gray-100 dark:bg-gray-900">
    <RouterView :key="route.fullPath" />
  </div>
</template>
