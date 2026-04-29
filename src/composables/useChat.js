import { reactive, computed } from 'vue'
import { api, streamPost } from '../api/client.js'

const THREADS_KEY = 'moneypenny_threads'

const state = reactive({
  threads: [],
  activeThreadId: null,
  messages: [],
  streaming: false,
})

function persistThreads() {
  localStorage.setItem(THREADS_KEY, JSON.stringify(state.threads))
}

export function useChat() {
  const activeThreadId = computed(() => state.activeThreadId)
  const messages = computed(() => state.messages)
  const threads = computed(() => state.threads)
  const streaming = computed(() => state.streaming)

  function loadThreads() {
    try {
      const stored = localStorage.getItem(THREADS_KEY)
      if (stored) {
        state.threads = JSON.parse(stored)
      }
    } catch {
      state.threads = []
    }
  }

  async function loadThread(threadId) {
    state.activeThreadId = threadId
    state.messages = []

    try {
      const res = await api.get(`/chat/${threadId}`)
      if (res.ok) {
        const data = await res.json()
        state.messages = data.messages.map((msg) => ({
          role: msg.role,
          content: msg.content,
        }))
      }
    } catch {
      // failed to load thread
    }
  }

  function newChat() {
    state.activeThreadId = null
    state.messages = []
  }

  async function sendMessage(text, tokenId = null) {
    state.messages.push({ role: 'human', content: text })
    state.messages.push({ role: 'ai', content: '' })
    state.streaming = true

    const path = state.activeThreadId
      ? `/chat/${state.activeThreadId}`
      : '/chat'

    try {
      const response = await streamPost(path, { message: text, token_id: tokenId })

      if (!response.ok) {
        const aiMsg = state.messages[state.messages.length - 1]
        aiMsg.content = 'Failed to get a response. Please try again.'
        state.streaming = false
        return
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const parts = buffer.split('\r\n\r\n')
        buffer = parts.pop()

        for (const part of parts) {
          if (!part.trim()) continue
          const lines = part.split('\r\n')
          let event = ''
          let data = ''

          for (const line of lines) {
            if (line.startsWith('event:')) {
              event = line.slice(6).trim()
            } else if (line.startsWith('data:')) {
              data = line.slice(5).trim()
            }
          }

          if (!data) continue

          const aiMsg = state.messages[state.messages.length - 1]

          if (event === 'chunk') {
            try {
              const parsed = JSON.parse(data)
              if (parsed.content) aiMsg.content += parsed.content
            } catch {
              // malformed chunk, skip
            }
          } else if (event === 'metadata') {
            try {
              const meta = JSON.parse(data)
              if (meta.thread_id) {
                state.activeThreadId = meta.thread_id
                const existing = state.threads.find((t) => t.thread_id === meta.thread_id)
                if (!existing) {
                  state.threads.unshift({
                    thread_id: meta.thread_id,
                    title: meta.title || 'New Chat',
                  })
                  persistThreads()
                }
              }
            } catch {
              // invalid metadata
            }
          }
        }
      }
    } catch {
      const aiMsg = state.messages[state.messages.length - 1]
      if (!aiMsg.content) {
        aiMsg.content = 'Connection error. Please try again.'
      }
    } finally {
      state.streaming = false
    }
  }

  return {
    threads,
    activeThreadId,
    messages,
    streaming,
    loadThreads,
    loadThread,
    newChat,
    sendMessage,
  }
}
