<script setup lang="ts">
import { onBeforeRouteUpdate, RouterView } from 'vue-router'
import '@/assets/output.css'
import { onMounted, onUpdated } from 'vue'
import { checkTokens } from '@/tokenUtils'
import { initFlowbite } from 'flowbite'
import { useRouter } from 'vue-router'

const router = useRouter()

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

onBeforeRouteUpdate((to) => {
  // if (to.meta.requiresAuth && !sessionStorage.getItem('accessToken')) {
  //   return { name: 'login' }
  // }
  if (to.path === '/') {
    return { name: 'dashboard' }
  }
})

</script>

<template>
  <div class="w-dvw h-dvh bg-gray-50 dark:bg-gray-900">
    <RouterView />
  </div>
</template>
