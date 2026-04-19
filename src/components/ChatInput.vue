<script setup>
import { ref, nextTick } from 'vue'

const props = defineProps({
  disabled: { type: Boolean, default: false },
})

const emit = defineEmits(['send'])

const message = ref('')
const textarea = ref(null)

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
  emit('send', text)
  message.value = ''
  nextTick(autoGrow)
}
</script>

<template>
  <form @submit.prevent="handleSend" class="flex items-end gap-3 p-4 border-t border-gray-800 bg-gray-950">
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
  </form>
</template>
