<script setup>
import { computed } from 'vue'
import { marked } from 'marked'
import DOMPurify from 'dompurify'

const props = defineProps({
  role: { type: String, required: true },
  content: { type: String, required: true },
})

marked.setOptions({ gfm: true, breaks: true })

const renderedContent = computed(() => {
  if (props.role === 'human' || !props.content) return ''
  return DOMPurify.sanitize(marked.parse(props.content))
})
</script>

<template>
  <div class="flex" :class="role === 'human' ? 'justify-end' : 'justify-start'">
    <div class="max-w-[80%] flex flex-col gap-2">
      <div
        v-if="role === 'human'"
        class="px-4 py-3 text-sm whitespace-pre-wrap bg-indigo-600 text-white rounded-xl rounded-br-sm"
      >
        {{ content }}
      </div>
      <div
        v-else-if="content"
        class="px-4 py-3 text-sm bg-gray-800 text-gray-100 rounded-xl rounded-bl-sm chat-md"
        v-html="renderedContent"
      />
    </div>
  </div>
</template>

<style scoped>
.chat-md :deep(p) { margin: 0 0 0.5rem 0; }
.chat-md :deep(p:last-child) { margin-bottom: 0; }
.chat-md :deep(ul), .chat-md :deep(ol) { margin: 0.25rem 0 0.5rem 1.25rem; }
.chat-md :deep(ul) { list-style: disc; }
.chat-md :deep(ol) { list-style: decimal; }
.chat-md :deep(li) { margin: 0.125rem 0; }
.chat-md :deep(code) {
  background: rgba(0,0,0,0.4);
  padding: 0.1rem 0.3rem;
  border-radius: 0.25rem;
  font-size: 0.85em;
}
.chat-md :deep(pre) {
  background: rgba(0,0,0,0.4);
  padding: 0.5rem 0.75rem;
  border-radius: 0.375rem;
  overflow-x: auto;
  margin: 0.5rem 0;
}
.chat-md :deep(pre code) { background: transparent; padding: 0; }
.chat-md :deep(a) { color: #818cf8; text-decoration: underline; }
.chat-md :deep(h1), .chat-md :deep(h2), .chat-md :deep(h3) {
  font-weight: 600;
  margin: 0.5rem 0 0.25rem 0;
}
.chat-md :deep(strong) { font-weight: 600; }
.chat-md :deep(em) { font-style: italic; }
.chat-md :deep(blockquote) {
  border-left: 2px solid #4b5563;
  padding-left: 0.75rem;
  margin: 0.25rem 0;
  color: #d1d5db;
}
</style>
