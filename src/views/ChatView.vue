<script setup>
import { ref, watch, onMounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppLayout from '../components/AppLayout.vue'
import ThreadList from '../components/ThreadList.vue'
import ChatMessage from '../components/ChatMessage.vue'
import ChatInput from '../components/ChatInput.vue'
import ConsentPrompt from '../components/ConsentPrompt.vue'
import DraftEmailModal from '../components/DraftEmailModal.vue'
import { useChat } from '../composables/useChat.js'
import { api } from '../api/client.js'

const SELECTED_TOKEN_KEY = 'moneypenny_selected_token_id'

const route = useRoute()
const router = useRouter()
const {
  threads,
  activeThreadId,
  messages,
  streaming,
  pendingInterrupts,
  loadThreads,
  loadThread,
  newChat,
  sendMessage,
  draftEmail,
  respond,
} = useChat()

const messagesContainer = ref(null)
const accounts = ref([])
const draftModalOpen = ref(false)
let accountsPromise = null

function persistedTokenId() {
  const raw = localStorage.getItem(SELECTED_TOKEN_KEY)
  if (raw === null || raw === '' || raw === 'null') return null
  const n = Number(raw)
  return Number.isFinite(n) ? n : null
}

function shouldAutoScroll() {
  const el = messagesContainer.value
  if (!el) return true
  return el.scrollHeight - el.scrollTop - el.clientHeight < 100
}

function scrollToBottom() {
  const el = messagesContainer.value
  if (el) {
    el.scrollTop = el.scrollHeight
  }
}

watch(messages, () => {
  if (shouldAutoScroll()) {
    nextTick(scrollToBottom)
  }
}, { deep: true })

async function handleSend({ text, token_id }) {
  if (accountsPromise) await accountsPromise
  if (!accounts.value.length) {
    router.push('/accounts')
    return
  }
  await sendMessage(text, token_id)
  if (activeThreadId.value && route.params.threadId !== activeThreadId.value) {
    router.replace(`/chat/${activeThreadId.value}`)
  }
}

function handleSelectThread(threadId) {
  router.push(`/chat/${threadId}`)
  loadThread(threadId)
}

function handleNewChat() {
  newChat()
  router.push('/chat')
}

async function handleDraftEmail() {
  if (accountsPromise) await accountsPromise
  if (!accounts.value.length) {
    router.push('/accounts')
    return
  }
  draftModalOpen.value = true
}

async function handleDraftSubmit(payload) {
  draftModalOpen.value = false
  await draftEmail(payload)
  if (activeThreadId.value && route.params.threadId !== activeThreadId.value) {
    router.replace(`/chat/${activeThreadId.value}`)
  }
}

async function fetchAccounts() {
  try {
    const res = await api.get('/accounts')
    if (res.ok) {
      accounts.value = await res.json()
    }
  } catch {
    // accounts left empty on failure; handleSend will redirect to /accounts
  }
}

onMounted(async () => {
  loadThreads()
  accountsPromise = fetchAccounts()

  if (route.params.threadId) {
    await loadThread(route.params.threadId)
  }
})
</script>

<template>
  <AppLayout>
    <div class="flex h-screen">
      <aside class="w-72 bg-gray-900 border-r border-gray-800 flex flex-col shrink-0">
        <ThreadList
          :threads="threads"
          :activeThreadId="activeThreadId"
          @select="handleSelectThread"
          @new-chat="handleNewChat"
          @draft-email="handleDraftEmail"
        />
      </aside>

      <div class="flex-1 flex flex-col min-w-0">
        <div ref="messagesContainer" class="flex-1 overflow-y-auto p-6 space-y-4">
          <template v-if="messages.length">
            <ChatMessage
              v-for="(msg, i) in messages"
              :key="i"
              :role="msg.role"
              :content="msg.content"
              :loading="streaming && i === messages.length - 1 && msg.role === 'ai'"
            />
          </template>
          <div v-else class="h-full flex flex-col items-center justify-center text-center">
            <svg class="w-16 h-16 text-gray-700 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <h2 class="text-xl font-semibold text-gray-400 mb-2">Start a conversation with Moneypenny</h2>
            <p class="text-gray-500 text-sm">Your AI email assistant</p>
          </div>
        </div>

        <ConsentPrompt
          v-if="pendingInterrupts.length"
          :interrupt="pendingInterrupts[0]"
          :disabled="streaming"
          @approve="(id) => respond(id, 'approve')"
          @reject="(id) => respond(id, 'reject')"
        />

        <ChatInput
          :disabled="streaming || pendingInterrupts.length > 0"
          :accounts="accounts"
          @send="handleSend"
        />
      </div>
    </div>

    <DraftEmailModal
      :open="draftModalOpen"
      :accounts="accounts"
      :defaultTokenId="persistedTokenId()"
      @close="draftModalOpen = false"
      @submit="handleDraftSubmit"
    />
  </AppLayout>
</template>
