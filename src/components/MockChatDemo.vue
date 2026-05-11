<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import ChatMessage from './ChatMessage.vue'

const props = defineProps({
  url: { type: String, default: 'moneypenny.mcmlln.dev/chat' },
  script: { type: Array, required: true },
  accounts: { type: Array, default: () => [] },
  defaultAccountIndex: { type: Number, default: 0 },
  compact: { type: Boolean, default: false },
})

const messages = ref([])
const inputText = ref('')
const inputActive = ref(false)
const selectedAccountIndex = ref(props.defaultAccountIndex)
const selectorActive = ref(false)
const root = ref(null)
const scrollEl = ref(null)

const HUMAN_CHAR_MS = 32
const AI_CHAR_MS = 14
const SUBMIT_PAUSE_MS = 350
const POST_SEND_MS = 450
const THINKING_MS = 950
const TURN_GAP_MS = 1400
const LOOP_GAP_MS = 3200
const RESET_PAUSE_MS = 400
const SELECTOR_PRE_MS = 350
const SELECTOR_HOLD_MS = 550
const SELECTOR_POST_MS = 450

let session = 0
const timeouts = new Set()

function setT(fn, ms) {
  const id = setTimeout(() => {
    timeouts.delete(id)
    fn()
  }, ms)
  timeouts.add(id)
}

function clearAll() {
  for (const id of timeouts) clearTimeout(id)
  timeouts.clear()
}

function pause(ms) {
  return new Promise((resolve) => setT(resolve, ms))
}

const reduceMotion =
  typeof window !== 'undefined' && window.matchMedia
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false

function scrollToBottom() {
  requestAnimationFrame(() => {
    if (scrollEl.value) scrollEl.value.scrollTop = scrollEl.value.scrollHeight
  })
}

async function playOnce(mySession) {
  messages.value = []
  inputText.value = ''
  inputActive.value = false
  selectedAccountIndex.value = props.defaultAccountIndex
  selectorActive.value = false
  await pause(RESET_PAUSE_MS)

  for (const turn of props.script) {
    if (mySession !== session) return

    if (
      turn.switchTo !== undefined &&
      turn.switchTo !== selectedAccountIndex.value &&
      props.accounts.length > 0
    ) {
      selectorActive.value = true
      await pause(SELECTOR_PRE_MS)
      if (mySession !== session) return
      selectedAccountIndex.value = turn.switchTo
      await pause(SELECTOR_HOLD_MS)
      if (mySession !== session) return
      selectorActive.value = false
      await pause(SELECTOR_POST_MS)
      if (mySession !== session) return
    }

    if (turn.role === 'human') {
      inputActive.value = true
      for (let i = 1; i <= turn.content.length; i++) {
        if (mySession !== session) return
        inputText.value = turn.content.slice(0, i)
        await pause(HUMAN_CHAR_MS)
      }
      await pause(SUBMIT_PAUSE_MS)
      if (mySession !== session) return
      const sent = inputText.value
      inputText.value = ''
      inputActive.value = false
      messages.value.push({ role: 'human', content: sent, loading: false })
      scrollToBottom()
      await pause(POST_SEND_MS)
    } else {
      const idx = messages.value.length
      messages.value.push({ role: 'ai', content: '', loading: true })
      scrollToBottom()
      await pause(THINKING_MS)
      if (mySession !== session) return
      const fullText = turn.content
      for (let i = 1; i <= fullText.length; i++) {
        if (mySession !== session) return
        messages.value[idx].content = fullText.slice(0, i)
        if (i % 6 === 0) scrollToBottom()
        await pause(AI_CHAR_MS)
      }
      scrollToBottom()
    }

    await pause(TURN_GAP_MS)
  }
}

async function loopForever() {
  const mySession = ++session
  while (mySession === session) {
    if (reduceMotion) {
      messages.value = props.script.map((t) => ({
        role: t.role,
        content: t.content,
        loading: false,
      }))
      inputText.value = ''
      scrollToBottom()
      await pause(LOOP_GAP_MS * 4)
      continue
    }
    await playOnce(mySession)
    if (mySession !== session) return
    await pause(LOOP_GAP_MS)
  }
}

function stop() {
  session++
  clearAll()
  messages.value = []
  inputText.value = ''
  inputActive.value = false
  selectedAccountIndex.value = props.defaultAccountIndex
  selectorActive.value = false
}

let observer
onMounted(() => {
  observer = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) loopForever()
        else stop()
      }
    },
    { threshold: 0.3 },
  )
  observer.observe(root.value)
})

onBeforeUnmount(() => {
  observer?.disconnect()
  stop()
})
</script>

<template>
  <div
    ref="root"
    class="rounded-xl overflow-hidden border border-gray-800 bg-gray-900 shadow-2xl shadow-black/40"
  >
    <div class="flex items-center gap-3 px-4 py-2.5 bg-gray-950 border-b border-gray-800">
      <div class="flex items-center gap-1.5 shrink-0">
        <span class="w-3 h-3 rounded-full bg-red-500" />
        <span class="w-3 h-3 rounded-full bg-yellow-500" />
        <span class="w-3 h-3 rounded-full bg-green-500" />
      </div>
      <div class="flex-1 flex justify-center px-4">
        <div
          class="bg-gray-800 text-gray-400 text-xs px-3 py-1 rounded-md max-w-md w-full text-center font-mono truncate"
        >
          {{ url }}
        </div>
      </div>
      <div class="w-12 shrink-0" aria-hidden="true" />
    </div>

    <div
      ref="scrollEl"
      class="bg-gray-950 overflow-y-auto p-6 flex flex-col gap-3"
      :class="compact ? 'h-[420px] lg:h-[210px]' : 'h-[420px]'"
    >
      <ChatMessage
        v-for="(m, i) in messages"
        :key="i"
        :role="m.role"
        :content="m.content"
        :loading="m.loading"
      />
    </div>

    <div
      class="flex flex-col gap-2 border-t border-gray-800 bg-gray-950"
      :class="compact ? 'p-3' : 'p-4'"
    >
      <div
        v-if="accounts.length"
        class="flex items-center gap-2 text-xs text-gray-400"
      >
        <span class="shrink-0">Account:</span>
        <div
          class="inline-flex items-center gap-1.5 bg-gray-800 border rounded-md text-gray-200 px-2 py-1 transition-all"
          :class="
            selectorActive
              ? 'border-transparent ring-2 ring-indigo-500'
              : 'border-gray-700'
          "
        >
          <span>{{ accounts[selectedAccountIndex]?.email }}</span>
          <svg
            class="w-3 h-3 text-gray-400 shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>
      <div class="flex items-end gap-3">
        <div
          class="flex-1 bg-gray-800 border rounded-lg text-white text-sm transition-colors"
          :class="[
            inputActive
              ? 'border-transparent ring-2 ring-indigo-500'
              : 'border-gray-700',
            compact ? 'px-3 py-2 min-h-10' : 'px-4 py-3 min-h-12',
          ]"
        >
          <template v-if="inputText">
            <span class="whitespace-pre-wrap break-words">{{ inputText }}</span
            ><span v-if="inputActive" class="caret" />
          </template>
          <template v-else>
            <span class="text-gray-500">Message Moneypenny...</span>
          </template>
        </div>
        <button
          type="button"
          tabindex="-1"
          aria-hidden="true"
          class="bg-indigo-600 text-white rounded-lg flex items-center justify-center shrink-0"
          :class="compact ? 'h-10 w-10' : 'h-12 w-12'"
        >
          <svg
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 19V5m0 0l-7 7m7-7l7 7"
            />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.caret {
  display: inline-block;
  width: 2px;
  height: 1.1em;
  background: #818cf8;
  margin-left: 1px;
  animation: blink 1s step-end infinite;
  vertical-align: text-bottom;
}
@keyframes blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}
</style>
