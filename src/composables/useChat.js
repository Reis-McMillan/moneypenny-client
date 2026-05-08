import { reactive, computed } from 'vue'
import { api, streamPost } from '../api/client.js'

const state = reactive({
  threads: [],
  activeThreadId: null,
  messages: [],
  streaming: false,
  loadingThread: false,
  pendingInterrupts: [],
  lastTokenId: null,
})

function bubbleActiveToTop() {
  const tid = state.activeThreadId
  if (!tid) return
  const idx = state.threads.findIndex((t) => t.thread_id === tid)
  if (idx > 0) {
    const [t] = state.threads.splice(idx, 1)
    state.threads.unshift(t)
  }
}

async function consumeSseStream(response) {
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
      const dataLines = []

      for (const line of lines) {
        if (line.startsWith('event:')) {
          event = line.slice(6).trim()
        } else if (line.startsWith('data:')) {
          dataLines.push(line.slice(5).replace(/^ /, ''))
        }
      }

      const data = dataLines.join('\n')
      if (!data) continue

      const aiMsg = state.messages[state.messages.length - 1]

      if (event === 'chunk') {
        try {
          const parsed = JSON.parse(data)
          if (parsed.content && aiMsg) aiMsg.content += parsed.content
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
            }
          }
        } catch {
          // invalid metadata
        }
      } else if (event === 'error') {
        try {
          const parsed = JSON.parse(data)
          console.error('[chat] error event', parsed)
          const errText = `Error: ${parsed.message || 'something went wrong.'}`
          if (aiMsg && aiMsg.role === 'ai') {
            aiMsg.content = aiMsg.content
              ? `${aiMsg.content}\n\n*${errText}*`
              : errText
          }
        } catch {
          // malformed error payload
        }
      } else if (event === 'interrupt') {
        try {
          const parsed = JSON.parse(data)
          console.log('[hitl] interrupt received', parsed)
          state.pendingInterrupts.push(parsed)
        } catch {
          // malformed interrupt
        }
      } else if (event === 'user_message') {
        const cleaned = data
          .split('\n')
          .map((line) => line.replace(/^\s+/, ''))
          .join('\n')
        const last = state.messages[state.messages.length - 1]
        if (last && last.role === 'ai' && !last.content) {
          state.messages.splice(state.messages.length - 1, 0, { role: 'human', content: cleaned })
        } else {
          state.messages.push({ role: 'human', content: cleaned })
          state.messages.push({ role: 'ai', content: '' })
        }
      }
    }
  }
}

export function useChat() {
  const activeThreadId = computed(() => state.activeThreadId)
  const messages = computed(() => state.messages)
  const threads = computed(() => state.threads)
  const streaming = computed(() => state.streaming)
  const loadingThread = computed(() => state.loadingThread)
  const pendingInterrupts = computed(() => state.pendingInterrupts)

  async function loadThreads() {
    try {
      const res = await api.get('/chat')
      if (res.ok) {
        const data = await res.json()
        state.threads = (data.chats || []).map((c) => ({
          thread_id: c.thread_id,
          title: c.title,
        }))
      }
    } catch {
      // best-effort; sidebar will just stay empty
    }
  }

  async function loadThread(threadId) {
    state.activeThreadId = threadId
    state.messages = []
    state.pendingInterrupts = []
    state.loadingThread = true

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
    } finally {
      state.loadingThread = false
    }
  }

  function newChat() {
    state.activeThreadId = null
    state.messages = []
    state.pendingInterrupts = []
  }

  async function sendMessage(text, tokenId = null) {
    state.lastTokenId = tokenId
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
        return
      }

      await consumeSseStream(response)
    } catch {
      const aiMsg = state.messages[state.messages.length - 1]
      if (!aiMsg.content) {
        aiMsg.content = 'Connection error. Please try again.'
      }
    } finally {
      state.streaming = false
      bubbleActiveToTop()
    }
  }

  async function draftEmail({ token_id, content, recipient, recipient_email }) {
    state.lastTokenId = token_id
    state.messages.push({ role: 'ai', content: '' })
    state.streaming = true

    const path = state.activeThreadId
      ? `/chat/${state.activeThreadId}/draft-email`
      : '/draft-email'

    try {
      const response = await streamPost(path, {
        token_id,
        content,
        recipient,
        recipient_email,
      })

      if (!response.ok) {
        state.messages.push({
          role: 'ai',
          content: 'Failed to start draft. Please try again.',
        })
        return
      }

      await consumeSseStream(response)
    } catch {
      state.messages.push({
        role: 'ai',
        content: 'Connection error during draft.',
      })
    } finally {
      state.streaming = false
      bubbleActiveToTop()
    }
  }

  async function respond(id, decision) {
    const idx = state.pendingInterrupts.findIndex((i) => i.id === id)
    if (idx === -1) return
    const [interrupt] = state.pendingInterrupts.splice(idx, 1)

    const actions = interrupt.value?.action_requests || []
    const decisions = actions.length
      ? actions.map(() => ({ type: decision }))
      : [{ type: decision }]

    console.log('[hitl] respond', { id, decision, decisions, interrupt })

    if (!state.activeThreadId) return

    state.streaming = true
    try {
      const response = await streamPost(
        `/chat/${state.activeThreadId}/resume`,
        {
          token_id: state.lastTokenId,
          decisions,
        },
      )

      if (!response.ok) {
        console.error('[hitl] resume failed', response.status)
        return
      }

      await consumeSseStream(response)
    } catch (e) {
      console.error('[hitl] resume error', e)
    } finally {
      state.streaming = false
      bubbleActiveToTop()
    }
  }

  return {
    threads,
    activeThreadId,
    messages,
    streaming,
    loadingThread,
    pendingInterrupts,
    loadThreads,
    loadThread,
    newChat,
    sendMessage,
    draftEmail,
    respond,
  }
}
