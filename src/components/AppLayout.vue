<script setup>
import AppNavbar from './AppNavbar.vue'
</script>

<template>
  <div class="min-h-screen bg-gray-950 text-gray-100 flex">
    <AppNavbar />
    <main class="flex-1 min-w-0 overflow-hidden">
      <slot />
    </main>
  </div>
</template>
