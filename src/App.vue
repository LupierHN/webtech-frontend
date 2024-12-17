<script setup lang="ts">
import { RouterView } from 'vue-router'
import SidebarAPI from '@/components/SidebarAPI.vue'
import HeaderAPI from '@/components/HeaderAPI.vue'
import '@/assets/output.css'
import { onMounted } from 'vue'

let accessToken: string;
let refreshToken: string;

onMounted(() => {
  accessToken = localStorage.getItem('accessToken') || ''
  refreshToken = localStorage.getItem('refreshToken') || ''

  if ((!accessToken || !refreshToken) && window.location.pathname !== '/login') {
    window.location.href = '/login'
  }
})

</script>

<template>

  <HeaderAPI title="Header" v-if="accessToken || refreshToken"></HeaderAPI>
  <SidebarAPI title="Sidebar" v-if="accessToken || refreshToken"></SidebarAPI>
  <RouterView />
</template>
