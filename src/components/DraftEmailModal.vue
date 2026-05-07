<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  open: { type: Boolean, default: false },
  accounts: { type: Array, default: () => [] },
  defaultTokenId: { type: Number, default: null },
})

const emit = defineEmits(['close', 'submit'])

const tokenId = ref(props.defaultTokenId)
const recipient = ref('')
const recipientEmail = ref('')
const content = ref('')

watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) {
      tokenId.value = props.defaultTokenId ?? props.accounts[0]?.token_id ?? null
      recipient.value = ''
      recipientEmail.value = ''
      content.value = ''
    }
  },
)

const canSubmit = computed(() => {
  return (
    tokenId.value !== null &&
    recipient.value.trim() &&
    recipientEmail.value.trim() &&
    content.value.trim()
  )
})

function onTokenChange(e) {
  tokenId.value = Number(e.target.value)
}

function handleSubmit() {
  if (!canSubmit.value) return
  emit('submit', {
    token_id: tokenId.value,
    recipient: recipient.value.trim(),
    recipient_email: recipientEmail.value.trim(),
    content: content.value.trim(),
  })
}

function handleKeydown(e) {
  if (e.key === 'Escape' && props.open) emit('close')
}

onMounted(() => window.addEventListener('keydown', handleKeydown))
onUnmounted(() => window.removeEventListener('keydown', handleKeydown))
</script>

<template>
  <div
    v-if="open"
    class="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
    @click.self="emit('close')"
  >
    <div class="bg-gray-900 border border-gray-800 rounded-xl shadow-2xl w-full max-w-lg p-6">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-semibold text-white">Draft Email</h2>
        <button
          @click="emit('close')"
          class="text-gray-400 hover:text-gray-200 cursor-pointer"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <form @submit.prevent="handleSubmit" class="flex flex-col gap-3">
        <label class="flex flex-col gap-1 text-xs text-gray-400">
          From account
          <select
            :value="tokenId === null ? '' : tokenId"
            @change="onTokenChange"
            class="bg-gray-800 border border-gray-700 rounded-md text-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option
              v-for="acc in accounts"
              :key="acc.token_id"
              :value="acc.token_id"
            >
              {{ acc.email }}
            </option>
          </select>
        </label>

        <label class="flex flex-col gap-1 text-xs text-gray-400">
          Recipient name
          <input
            v-model="recipient"
            type="text"
            placeholder="Jane Doe"
            class="bg-gray-800 border border-gray-700 rounded-md text-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </label>

        <label class="flex flex-col gap-1 text-xs text-gray-400">
          Recipient email
          <input
            v-model="recipientEmail"
            type="email"
            placeholder="jane@example.com"
            class="bg-gray-800 border border-gray-700 rounded-md text-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </label>

        <label class="flex flex-col gap-1 text-xs text-gray-400">
          What should the email say?
          <textarea
            v-model="content"
            rows="5"
            placeholder="e.g. Confirm tomorrow's 3pm meeting and ask Jane to bring the Q2 deck."
            class="bg-gray-800 border border-gray-700 rounded-md text-gray-200 px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </label>

        <div class="flex gap-2 justify-end mt-2">
          <button
            type="button"
            @click="emit('close')"
            class="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800 rounded-md transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            :disabled="!canSubmit"
            class="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium rounded-md transition-colors cursor-pointer"
          >
            Draft
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
