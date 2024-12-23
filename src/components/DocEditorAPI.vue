<script setup lang="ts">


config: {
  placeholderText: 'Edit Your Content Here!',
  charCounterCount: false
}
</script>

<template>
  <froala id="edit" :tag="'textarea'" :config="config" v-model:value="model"></froala>
</template>

<style scoped>



</style>
