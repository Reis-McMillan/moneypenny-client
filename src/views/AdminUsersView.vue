<script setup>
import { ref, onMounted } from 'vue'
import AppLayout from '../components/AppLayout.vue'
import { api } from '../api/client.js'

const users = ref([])
const loading = ref(true)
const error = ref('')
const deletingKey = ref(null)

async function fetchUsers() {
  loading.value = true
  error.value = ''
  try {
    const res = await api.get('/test-users')
    if (res.ok) {
      users.value = await res.json()
    } else if (res.status === 403) {
      error.value = 'You do not have permission to view this page.'
    } else {
      error.value = 'Failed to load test users.'
    }
  } catch {
    error.value = 'Network error. Please try again.'
  } finally {
    loading.value = false
  }
}

async function deleteUser(user) {
  const label = `${user.first_name} ${user.last_name}`
  if (!window.confirm(`Remove ${label} from the waitlist? This cannot be undone.`)) {
    return
  }

  const key = `${user.first_name}|${user.last_name}`
  deletingKey.value = key
  error.value = ''

  try {
    const params = new URLSearchParams({
      first_name: user.first_name,
      last_name: user.last_name,
    })
    const res = await api.delete(`/test-users?${params.toString()}`)
    if (res.ok) {
      users.value = users.value.filter(
        (u) =>
          !(u.first_name === user.first_name && u.last_name === user.last_name),
      )
    } else {
      error.value = `Failed to remove ${label}.`
    }
  } catch {
    error.value = 'Network error. Please try again.'
  } finally {
    deletingKey.value = null
  }
}

onMounted(fetchUsers)
</script>

<template>
  <AppLayout>
    <div class="max-w-4xl mx-auto p-8">
      <header class="mb-8 flex items-end justify-between gap-4">
        <div>
          <h1 class="text-3xl font-bold text-white">Test User Signups</h1>
          <p class="text-sm text-gray-400 mt-1">
            Waitlist entries from the public sign-up form.
          </p>
        </div>
        <span
          v-if="!loading && !error"
          class="text-xs text-gray-500 shrink-0 pb-1"
        >
          {{ users.length }} {{ users.length === 1 ? 'entry' : 'entries' }}
        </span>
      </header>

      <div
        v-if="error"
        class="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-3 mb-6"
      >
        {{ error }}
      </div>

      <div v-if="loading" class="text-gray-400 text-center py-12">
        <svg
          class="animate-spin h-8 w-8 mx-auto mb-4 text-indigo-400"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            class="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
          />
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
        <p>Loading test users...</p>
      </div>

      <div
        v-else-if="!users.length"
        class="text-center py-16 border border-dashed border-gray-700 rounded-xl"
      >
        <p class="text-gray-400">No waitlist signups yet.</p>
      </div>

      <ul v-else class="space-y-3">
        <li
          v-for="user in users"
          :key="`${user.first_name}|${user.last_name}`"
          class="rounded-xl border border-gray-800 bg-gray-900 p-5 flex flex-col sm:flex-row sm:items-start gap-4"
        >
          <div class="flex-1 min-w-0 space-y-2">
            <div class="text-white font-medium">
              {{ user.first_name }} {{ user.last_name }}
            </div>
            <div class="flex flex-wrap gap-1.5">
              <span
                v-for="em in user.emails"
                :key="em"
                class="inline-flex items-center text-xs text-gray-300 bg-gray-800 border border-gray-700 rounded-md px-2 py-1 font-mono"
              >
                {{ em }}
              </span>
            </div>
          </div>

          <button
            type="button"
            @click="deleteUser(user)"
            :disabled="
              deletingKey === `${user.first_name}|${user.last_name}`
            "
            class="shrink-0 inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-red-300 hover:text-red-200 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 rounded-md transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M1 7h22M9 7V4a1 1 0 011-1h4a1 1 0 011 1v3"
              />
            </svg>
            {{
              deletingKey === `${user.first_name}|${user.last_name}`
                ? 'Removing…'
                : 'Remove'
            }}
          </button>
        </li>
      </ul>
    </div>
  </AppLayout>
</template>
