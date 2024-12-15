<script setup lang="ts">
import { RouterView } from 'vue-router'
import { RouterLink } from 'vue-router'
import Sidebar from '@/components/SidebarAPI.vue'
import '@/assets/output.css'
</script>

<template>
<!--  <Sidebar title="Sidebar"></Sidebar>-->
  <header>
    <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="125" height="125" />

    <div class="wrapper">
      <nav>
        <RouterLink to="/dashboard">Dashboard</RouterLink>
      </nav>
    </div>
  </header>
  <RouterView />
</template>
