<script setup>
defineProps({
  threads: { type: Array, required: true },
  activeThreadId: { type: String, default: null },
})

const emit = defineEmits(['select', 'new-chat'])
</script>

<template>
  <div class="flex flex-col h-full">
    <div class="p-3">
      <button
        @click="emit('new-chat')"
        class="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg transition-colors cursor-pointer"
      >
        New Chat
      </button>
    </div>

    <div class="flex-1 overflow-y-auto px-2 pb-2">
      <div
        v-for="thread in threads"
        :key="thread.thread_id"
        @click="emit('select', thread.thread_id)"
        class="px-3 py-2 rounded-md text-sm cursor-pointer transition-colors truncate"
        :class="
          thread.thread_id === activeThreadId
            ? 'bg-gray-800 text-white'
            : 'text-gray-400 hover:bg-gray-800 hover:text-gray-300'
        "
      >
        {{ thread.title }}
      </div>

      <div v-if="!threads.length" class="px-3 py-4 text-sm text-gray-500 text-center">
        No conversations yet
      </div>
    </div>
  </div>
</template>
