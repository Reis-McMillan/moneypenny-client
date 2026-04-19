<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth.js'
import { exchangeToken, getTokens } from '../api/client.js'

const router = useRouter()
const { isAuthenticated, fetchUser } = useAuth()

const error = ref('')

onMounted(async () => {
  if (!isAuthenticated.value) {
    await fetchUser()
  }

  if (!isAuthenticated.value) {
    error.value = 'Authentication session expired. Please sign in again.'
    return
  }

  const { exchangedToken } = getTokens()
  if (!exchangedToken) {
    const exchanged = await exchangeToken()
    if (!exchanged) {
      error.value = 'Failed to complete backend setup. Please try signing in again.'
      return
    }
  }

  router.push('/chat')
})
</script>

<template>
  <div class="min-h-screen bg-gray-950 flex items-center justify-center px-4">
    <div class="w-full max-w-md text-center">
      <div v-if="error" class="bg-gray-900 border border-gray-800 rounded-2xl p-8 shadow-2xl">
        <h1 class="text-2xl font-bold text-white mb-4">Setup Error</h1>
        <p class="text-red-400 mb-6">{{ error }}</p>
        <router-link
          to="/login"
          class="inline-block py-2 px-6 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-lg transition-colors"
        >
          Back to Sign In
        </router-link>
      </div>
      <div v-else class="text-gray-400">
        <svg class="animate-spin h-8 w-8 mx-auto mb-4 text-indigo-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
        <p>Completing backend setup...</p>
      </div>
    </div>
  </div>
</template>
