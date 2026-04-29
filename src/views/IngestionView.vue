<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import AppLayout from '../components/AppLayout.vue'
import { api } from '../api/client.js'

const counts = ref(null)
const status = ref(null)
const loading = ref(true)
const error = ref('')
let timer = null

async function fetchAll() {
  error.value = ''
  try {
    const [countsRes, statusRes] = await Promise.all([
      api.get('/ingest/counts'),
      api.get('/ingest/status'),
    ])
    if (countsRes.ok) counts.value = await countsRes.json()
    else error.value = 'Failed to load counts.'

    if (statusRes.ok) status.value = await statusRes.json()
    else error.value = error.value || 'Failed to load status.'
  } catch {
    error.value = 'Network error. Please try again.'
  } finally {
    loading.value = false
  }
}

function formatTime(iso) {
  if (!iso) return '—'
  try {
    const d = new Date(iso)
    return d.toLocaleString()
  } catch {
    return iso
  }
}

onMounted(() => {
  fetchAll()
  timer = setInterval(fetchAll, 10000)
})

onBeforeUnmount(() => {
  if (timer) clearInterval(timer)
})
</script>

<template>
  <AppLayout>
    <div class="max-w-5xl mx-auto p-8">
      <div class="flex items-center justify-between mb-8">
        <h1 class="text-3xl font-bold text-white">Ingestion</h1>
        <button
          @click="fetchAll"
          class="bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium px-4 py-2 rounded-md transition-colors cursor-pointer"
        >
          Refresh
        </button>
      </div>

      <div v-if="error" class="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-3 mb-6">
        {{ error }}
      </div>

      <div v-if="loading" class="text-gray-400 text-center py-12">
        <svg class="animate-spin h-8 w-8 mx-auto mb-4 text-indigo-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
        <p>Loading ingestion data...</p>
      </div>

      <template v-else>
        <section class="mb-10">
          <h2 class="text-xl font-semibold text-white mb-3">Email Counts</h2>
          <div class="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <div class="text-sm text-gray-400 mb-1">Total ingested</div>
            <div class="text-2xl font-mono text-white mb-6">{{ counts?.total ?? 0 }}</div>

            <table v-if="counts?.accounts?.length" class="w-full text-sm">
              <thead>
                <tr class="text-gray-400 border-b border-gray-800">
                  <th class="text-left font-medium py-2">Provider</th>
                  <th class="text-left font-medium py-2">Subject</th>
                  <th class="text-right font-medium py-2">Count</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="acc in counts.accounts"
                  :key="`${acc.provider_id}-${acc.subject}`"
                  class="border-b border-gray-900 last:border-b-0"
                >
                  <td class="py-2 text-gray-300 capitalize">{{ acc.provider_id }}</td>
                  <td class="py-2 text-gray-300 font-mono">{{ acc.subject }}</td>
                  <td class="py-2 text-right text-gray-100 font-mono">{{ acc.count }}</td>
                </tr>
              </tbody>
            </table>
            <p v-else class="text-gray-500 text-sm">No connected accounts.</p>
          </div>
        </section>

        <section>
          <h2 class="text-xl font-semibold text-white mb-3">Service Status</h2>
          <div class="bg-gray-900 border border-gray-800 rounded-xl p-6 overflow-x-auto">
            <table v-if="status?.services?.length" class="w-full text-sm">
              <thead>
                <tr class="text-gray-400 border-b border-gray-800">
                  <th class="text-left font-medium py-2">Provider</th>
                  <th class="text-left font-medium py-2">Subject</th>
                  <th class="text-left font-medium py-2">Ingesting</th>
                  <th class="text-left font-medium py-2">Task Alive</th>
                  <th class="text-left font-medium py-2">Last Run</th>
                  <th class="text-left font-medium py-2">Last Error</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="svc in status.services"
                  :key="`${svc.provider_id}-${svc.subject}`"
                  class="border-b border-gray-900 last:border-b-0"
                  :class="svc.last_error ? 'bg-red-500/5' : ''"
                >
                  <td class="py-2 text-gray-300 capitalize">{{ svc.provider_id }}</td>
                  <td class="py-2 text-gray-300 font-mono">{{ svc.subject }}</td>
                  <td class="py-2">
                    <span
                      class="px-2 py-0.5 rounded-md text-xs font-medium"
                      :class="svc.currently_ingesting ? 'bg-emerald-500/20 text-emerald-300' : 'bg-gray-800 text-gray-400'"
                    >
                      {{ svc.currently_ingesting ? 'yes' : 'no' }}
                    </span>
                  </td>
                  <td class="py-2">
                    <span
                      class="px-2 py-0.5 rounded-md text-xs font-medium"
                      :class="svc.task_alive ? 'bg-emerald-500/20 text-emerald-300' : 'bg-gray-800 text-gray-500'"
                    >
                      {{ svc.task_alive ? 'alive' : 'stopped' }}
                    </span>
                  </td>
                  <td class="py-2 text-gray-300 font-mono text-xs">{{ formatTime(svc.last_run_at) }}</td>
                  <td class="py-2 text-red-300 text-xs">
                    <div v-if="svc.last_error">
                      <div>{{ svc.last_error }}</div>
                      <div class="text-gray-500 text-[10px] mt-0.5">{{ formatTime(svc.last_error_at) }}</div>
                    </div>
                    <span v-else class="text-gray-600">—</span>
                  </td>
                </tr>
              </tbody>
            </table>
            <p v-else class="text-gray-500 text-sm">No active ingestion services.</p>
          </div>
        </section>
      </template>
    </div>
  </AppLayout>
</template>
