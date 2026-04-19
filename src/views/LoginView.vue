<script setup>
import { useAuth } from '../composables/useAuth.js'

const { startOAuthFlow } = useAuth()
</script>

<template>
  <div class="min-h-screen bg-gray-950 flex items-center justify-center px-4">
    <div class="w-full max-w-md">
      <div class="bg-gray-900 border border-gray-800 rounded-2xl p-8 shadow-2xl">
        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold text-white mb-2">Moneypenny</h1>
          <p class="text-gray-400">Your AI email assistant</p>
        </div>

        <button
          @click="startOAuthFlow"
          class="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-lg transition-colors cursor-pointer"
        >
          Sign In
        </button>
      </div>
    </div>
  </div>
</template>
