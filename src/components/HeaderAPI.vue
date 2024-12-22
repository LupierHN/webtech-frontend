<script setup lang="ts">

</script>

<template>
  <div
    class="flex items-center justify-between p-4 border-b bg-white shadow-sm ml-64"
  >
    <!-- Suche -->
    <div class="flex items-center m-auto w-1/2">
      <div class="relative w-full">
        <input type="text" placeholder="Search" class="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300 w-full"/>
        <svg
          class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M21 21l-4.35-4.35m-2.9-2.9a7 7 0 1 0-9.9-9.9 7 7 0 0 0 9.9 9.9z"
          />
        </svg>
      </div>
    </div>

    <!-- Icons & Profil -->
    <div class="flex items-center gap-4">
      <!-- Glocken Icon -->
      <button class="relative">
        <svg
          class="w-6 h-6 text-gray-600 hover:text-blue-600"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14V10a6 6 0 10-12 0v4c0 .586-.214 1.144-.595 1.595L4 17h5m6 0a3 3 0 11-6 0"
          />
        </svg>
      </button>

      <!-- Profil-Icon & Name -->
      <div class="flex items-center gap-2">
        <span class="text-gray-700 font-medium">Tom Cook</span>
      </div>
    </div>
  </div>

</template>

<style scoped>

</style>
