<script setup>
defineProps({
  role: { type: String, required: true },
  content: { type: String, required: true },
})
</script>

<template>
  <div class="flex" :class="role === 'human' ? 'justify-end' : 'justify-start'">
    <div
      class="max-w-[80%] px-4 py-3 text-sm whitespace-pre-wrap"
      :class="
        role === 'human'
          ? 'bg-indigo-600 text-white rounded-xl rounded-br-sm'
          : 'bg-gray-800 text-gray-100 rounded-xl rounded-bl-sm'
      "
    >
      {{ content }}
    </div>
  </div>
</template>
