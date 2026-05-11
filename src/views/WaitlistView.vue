<script setup>
import { ref, computed } from 'vue'
import { api } from '../api/client.js'

const firstName = ref('')
const lastName = ref('')
const emailInput = ref('')
const emails = ref([])
const error = ref('')
const loading = ref(false)
const submitted = ref(false)

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const canAddEmail = computed(() => {
  const trimmed = emailInput.value.trim()
  return (
    EMAIL_RE.test(trimmed) &&
    !emails.value.includes(trimmed.toLowerCase())
  )
})

const canSubmit = computed(() => {
  return (
    !loading.value &&
    firstName.value.trim() &&
    lastName.value.trim() &&
    emails.value.length > 0
  )
})

function addEmail() {
  const trimmed = emailInput.value.trim().toLowerCase()
  if (!EMAIL_RE.test(trimmed)) {
    error.value = 'Please enter a valid email address.'
    return
  }
  if (emails.value.includes(trimmed)) {
    error.value = 'That email is already on the list.'
    return
  }
  emails.value.push(trimmed)
  emailInput.value = ''
  error.value = ''
}

function removeEmail(index) {
  emails.value.splice(index, 1)
}

async function handleSubmit() {
  if (!canSubmit.value) {
    if (!emails.value.length) {
      error.value = 'Add at least one email address.'
    }
    return
  }

  error.value = ''
  loading.value = true

  try {
    const res = await api.post('/test-users', {
      first_name: firstName.value.trim(),
      last_name: lastName.value.trim(),
      emails: emails.value,
    })
    if (res.ok) {
      submitted.value = true
    } else {
      const body = await res.json().catch(() => ({}))
      error.value = body.detail || 'Something went wrong. Please try again.'
    }
  } catch {
    error.value = 'Network error. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-950 text-gray-100 flex flex-col">
    <div class="flex-1 max-w-lg w-full mx-auto px-6 py-16">
      <header class="mb-10 text-center space-y-3">
        <h1 class="text-3xl font-bold text-white tracking-tight">
          Join the waitlist
        </h1>
        <p class="text-sm text-gray-400 leading-relaxed">
          Moneypenny is in private beta. Drop your details and we'll be in touch
          when test access opens up for the inboxes you list below.
        </p>
      </header>

      <div
        v-if="submitted"
        class="bg-emerald-500/10 border border-emerald-500/30 rounded-lg px-5 py-6 text-center space-y-2"
      >
        <p class="text-emerald-300 font-medium">You're on the list.</p>
        <p class="text-sm text-gray-400">
          Thanks, {{ firstName }} — we'll reach out at the addresses you
          provided when a test slot opens up.
        </p>
      </div>

      <form v-else @submit.prevent="handleSubmit" class="space-y-6">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label
              for="first_name"
              class="block text-sm font-medium text-gray-300 mb-2"
            >
              First name
            </label>
            <input
              id="first_name"
              v-model="firstName"
              type="text"
              required
              autocomplete="given-name"
              placeholder="Ada"
              class="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
            />
          </div>
          <div>
            <label
              for="last_name"
              class="block text-sm font-medium text-gray-300 mb-2"
            >
              Last name
            </label>
            <input
              id="last_name"
              v-model="lastName"
              type="text"
              required
              autocomplete="family-name"
              placeholder="Lovelace"
              class="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
            />
          </div>
        </div>

        <div>
          <label
            for="email"
            class="block text-sm font-medium text-gray-300 mb-1"
          >
            Email addresses
          </label>
          <p class="text-xs text-gray-500 mb-3">
            Add the email accounts you intend to use with Moneypenny.
          </p>

          <div class="flex gap-2">
            <input
              id="email"
              v-model="emailInput"
              @keydown.enter.prevent="addEmail"
              type="email"
              autocomplete="email"
              placeholder="you@example.com"
              class="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
            />
            <button
              type="button"
              @click="addEmail"
              :disabled="!canAddEmail"
              class="px-4 py-3 bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg border border-gray-700 transition-colors cursor-pointer shrink-0"
            >
              Add email
            </button>
          </div>

          <ul v-if="emails.length" class="mt-3 space-y-2">
            <li
              v-for="(em, i) in emails"
              :key="em"
              class="flex items-center justify-between bg-gray-800/60 border border-gray-700 rounded-lg px-3 py-2"
            >
              <span class="text-sm text-gray-200 truncate">{{ em }}</span>
              <button
                type="button"
                @click="removeEmail(i)"
                :aria-label="`Remove ${em}`"
                class="text-gray-500 hover:text-red-400 transition-colors shrink-0 ml-3 cursor-pointer"
              >
                <svg
                  class="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </li>
          </ul>
        </div>

        <div
          v-if="error"
          class="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-3"
        >
          {{ error }}
        </div>

        <button
          type="submit"
          :disabled="!canSubmit"
          class="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors cursor-pointer"
        >
          {{ loading ? 'Submitting…' : 'Join waitlist' }}
        </button>
      </form>
    </div>

    <footer class="border-t border-gray-800">
      <div
        class="max-w-5xl mx-auto px-6 py-8 flex flex-col sm:flex-row justify-between items-center gap-4"
      >
        <p class="text-xs text-gray-500">
          © 2026 Moneypenny. All rights reserved.
        </p>
        <nav class="flex items-center gap-6">
          <router-link
            to="/terms"
            class="text-xs text-gray-500 hover:text-gray-300 transition-colors"
          >
            Terms of Service
          </router-link>
          <router-link
            to="/privacy"
            class="text-xs text-gray-500 hover:text-gray-300 transition-colors"
          >
            Privacy Policy
          </router-link>
          <router-link
            to="/ai-transparency"
            class="text-xs text-gray-500 hover:text-gray-300 transition-colors"
          >
            AI Transparency
          </router-link>
        </nav>
      </div>
    </footer>
  </div>
</template>
