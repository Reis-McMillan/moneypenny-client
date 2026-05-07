<script setup>
import { computed } from 'vue'

const props = defineProps({
  interrupt: { type: Object, required: true },
  disabled: { type: Boolean, default: false },
})

const emit = defineEmits(['approve', 'reject'])

const actionRequests = computed(() => props.interrupt.value?.action_requests || [])

function formatValue(value) {
  if (value === null || value === undefined) return ''
  if (typeof value === 'string') return value
  if (typeof value === 'number' || typeof value === 'boolean') return String(value)
  try {
    return JSON.stringify(value, null, 2)
  } catch {
    return String(value)
  }
}

function isBlockValue(value) {
  if (value === null || value === undefined) return false
  if (typeof value === 'object') return true
  if (typeof value !== 'string') return false
  return value.length > 60 || value.includes('\n')
}
</script>

<template>
  <div class="border-t border-amber-500/30 bg-amber-950/30 p-4">
    <div class="flex items-center gap-2 mb-3">
      <svg class="w-4 h-4 shrink-0 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
      <div class="text-sm font-medium text-amber-100">
        Approval needed
        <span v-if="actionRequests.length > 1" class="text-amber-200/60 font-normal">
          ({{ actionRequests.length }} actions)
        </span>
      </div>
    </div>

    <div class="space-y-2 mb-4">
      <div
        v-for="(action, idx) in actionRequests"
        :key="idx"
        class="bg-gray-900/70 border border-gray-800 rounded-lg overflow-hidden"
      >
        <div class="px-3 py-1.5 bg-gray-800/60 text-xs font-mono text-amber-300">
          {{ action.name }}
        </div>
        <div class="px-3 py-2 space-y-2">
          <template v-for="(value, key) in (action.args || {})" :key="key">
            <div v-if="isBlockValue(value)" class="flex flex-col gap-1">
              <div class="text-[10px] uppercase tracking-wider text-gray-500 font-mono">
                {{ key }}
              </div>
              <div class="text-xs text-gray-200 bg-black/30 rounded px-2 py-1.5 whitespace-pre-wrap wrap-break-word max-h-48 overflow-y-auto">{{ formatValue(value) }}</div>
            </div>
            <div v-else class="flex gap-2 text-xs items-baseline">
              <div class="text-gray-500 shrink-0 w-24 font-mono">{{ key }}</div>
              <div class="text-gray-100 wrap-break-word min-w-0">{{ formatValue(value) }}</div>
            </div>
          </template>
        </div>
      </div>
    </div>

    <div class="flex gap-2 justify-end">
      <button
        @click="emit('reject', interrupt.id)"
        :disabled="disabled"
        class="px-4 py-2 bg-red-600/90 hover:bg-red-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium rounded-md transition-colors cursor-pointer"
      >
        Deny
      </button>
      <button
        @click="emit('approve', interrupt.id)"
        :disabled="disabled"
        class="px-4 py-2 bg-green-600/90 hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium rounded-md transition-colors cursor-pointer"
      >
        Approve
      </button>
    </div>
  </div>
</template>
