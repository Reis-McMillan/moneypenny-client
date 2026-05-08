<script setup>
import { ref, onMounted } from 'vue'
import AppLayout from '../components/AppLayout.vue'
import { api } from '../api/client.js'
import { useActions } from '../composables/useActions.js'

const accounts = ref([])
const loading = ref(true)
const error = ref('')
const showProviders = ref(false)

const { loadActions, findActionForToken } = useActions()

function reauth(action) {
  if (action?.reauth_url) {
    window.location.href = action.reauth_url
  }
}

async function fetchAccounts() {
  loading.value = true
  error.value = ''
  try {
    const res = await api.get('/accounts')
    if (res.ok) {
      accounts.value = await res.json()
    } else {
      error.value = 'Failed to load accounts.'
    }
  } catch {
    error.value = 'Network error. Please try again.'
  } finally {
    loading.value = false
  }
}

async function linkAccount(providerId) {
  showProviders.value = false
  try {
    const res = await api.post(`/accounts/link?provider_id=${encodeURIComponent(providerId)}`)
    if (res.ok) {
      const data = await res.json()
      if (data.redirect_url) {
        window.location.href = data.redirect_url
      }
    } else {
      error.value = 'Failed to link account.'
    }
  } catch {
    error.value = 'Network error. Please try again.'
  }
}

onMounted(async () => {
  await Promise.all([fetchAccounts(), loadActions()])
})
</script>

<template>
  <AppLayout>
    <div class="max-w-4xl mx-auto p-8">
      <h1 class="text-3xl font-bold text-white mb-8">Email Accounts</h1>

      <div v-if="error" class="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-3 mb-6">
        {{ error }}
      </div>

      <div v-if="loading" class="text-gray-400 text-center py-12">
        <svg class="animate-spin h-8 w-8 mx-auto mb-4 text-indigo-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
        <p>Loading accounts...</p>
      </div>

      <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div
          v-for="account in accounts"
          :key="`${account.provider_id}-${account.email}`"
          class="rounded-xl p-6 border"
          :class="findActionForToken(account.token_id) ? 'border-red-500/50 bg-red-950/20' : 'border-gray-800 bg-gray-900'"
        >
          <div class="text-sm text-gray-400 mb-1">Provider</div>
          <div class="text-white font-medium mb-3 capitalize">{{ account.provider_id }}</div>
          <div class="text-sm text-gray-400 mb-1">Account</div>
          <div class="text-gray-300 text-sm font-mono truncate">{{ account.email }}</div>

          <button
            v-if="findActionForToken(account.token_id)"
            @click="reauth(findActionForToken(account.token_id))"
            class="mt-4 w-full px-3 py-2 bg-red-600/90 hover:bg-red-500 text-white text-sm font-medium rounded-md transition-colors cursor-pointer flex items-center justify-center gap-2"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            Re-authorize required
          </button>
        </div>

        <div class="relative">
          <button
            @click="showProviders = !showProviders"
            class="w-full h-full min-h-35 border-2 border-dashed border-gray-600 rounded-xl flex flex-col items-center justify-center gap-2 text-gray-400 hover:text-gray-300 hover:border-gray-500 transition-colors cursor-pointer bg-transparent"
          >
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            <span class="text-sm font-medium">Link Account</span>
          </button>

          <div
            v-if="showProviders"
            class="absolute top-full left-0 mt-2 w-full bg-gray-900 border border-gray-700 rounded-lg shadow-2xl z-10 overflow-hidden"
          >
            <button
              @click="linkAccount('google')"
              class="w-full px-4 py-3 text-left text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors cursor-pointer"
            >
              Google
            </button>
            <button
              @click="linkAccount('microsoft')"
              class="w-full px-4 py-3 text-left text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors cursor-pointer border-t border-gray-800"
            >
              Microsoft
            </button>
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>
