<script setup>
import { ref, nextTick, computed, watch } from 'vue'

const props = defineProps({
  disabled: { type: Boolean, default: false },
  accounts: { type: Array, default: () => [] },
})

const emit = defineEmits(['send'])

const STORAGE_KEY = 'moneypenny_selected_token_id'

const message = ref('')
const textarea = ref(null)

function loadInitialTokenId() {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (raw === null || raw === '' || raw === 'null') return null
  const n = Number(raw)
  return Number.isFinite(n) ? n : null
}

const selectedTokenId = ref(loadInitialTokenId())

watch(selectedTokenId, (val) => {
  if (val === null || val === undefined) {
    localStorage.setItem(STORAGE_KEY, 'null')
  } else {
    localStorage.setItem(STORAGE_KEY, String(val))
  }
})

watch(
  () => props.accounts,
  (accs) => {
    if (selectedTokenId.value === null) return
    const stillExists = accs.some((a) => a.token_id === selectedTokenId.value)
    if (!stillExists) selectedTokenId.value = null
  },
)

const accountLabel = computed(() => {
  if (selectedTokenId.value === null) return 'All accounts'
  const acc = props.accounts.find((a) => a.token_id === selectedTokenId.value)
  return acc?.email || acc?.subject || `token_id=${selectedTokenId.value}`
})

function autoGrow() {
  const el = textarea.value
  if (!el) return
  el.style.height = 'auto'
  el.style.height = Math.min(el.scrollHeight, 160) + 'px'
}

function handleKeydown(e) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    handleSend()
  }
}

function handleSend() {
  const text = message.value.trim()
  if (!text || props.disabled) return
  emit('send', { text, token_id: selectedTokenId.value })
  message.value = ''
  nextTick(autoGrow)
}

function onSelectChange(e) {
  const v = e.target.value
  selectedTokenId.value = v === '' ? null : Number(v)
}
</script>

<template>
  <form @submit.prevent="handleSend" class="flex flex-col gap-2 p-4 border-t border-gray-800 bg-gray-950">
    <div class="flex items-center gap-2 text-xs text-gray-400">
      <label for="account-select" class="shrink-0">Account:</label>
      <select
        id="account-select"
        :value="selectedTokenId === null ? '' : selectedTokenId"
        @change="onSelectChange"
        :disabled="disabled"
        class="bg-gray-800 border border-gray-700 rounded-md text-gray-200 px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        <option value="">All accounts</option>
        <option
          v-for="acc in accounts"
          :key="acc.token_id"
          :value="acc.token_id"
        >
          {{ acc.email || acc.subject }}
        </option>
      </select>
      <span class="text-gray-500 truncate">→ {{ accountLabel }}</span>
    </div>

    <div class="flex items-end gap-3">
      <textarea
        ref="textarea"
        v-model="message"
        @input="autoGrow"
        @keydown="handleKeydown"
        rows="1"
        placeholder="Message Moneypenny..."
        :disabled="disabled"
        class="flex-1 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
      />
      <button
        type="submit"
        :disabled="disabled || !message.trim()"
        class="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg p-3 transition-colors cursor-pointer"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19V5m0 0l-7 7m7-7l7 7" />
        </svg>
      </button>
    </div>
  </form>
</template>
