<script setup>
import { useAuth } from '../composables/useAuth.js'

const { user, logout } = useAuth()

function handleSignOut() {
  logout()
}
</script>

<template>
  <div class="min-h-screen bg-gray-950 text-gray-100 flex flex-col">
    <div class="flex-1 flex items-center justify-center px-6 py-16">
      <div class="max-w-md w-full text-center space-y-6">
        <div class="flex justify-center">
          <div
            class="w-16 h-16 rounded-full bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center"
          >
            <svg
              class="w-8 h-8 text-indigo-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>

        <div class="space-y-2">
          <h1 class="text-2xl font-bold text-white tracking-tight">
            Your account is pending approval
          </h1>
          <p class="text-sm text-gray-400 leading-relaxed">
            Moneypenny is in private beta. We'll email
            <span v-if="user?.email" class="text-gray-200">{{ user.email }}</span>
            <span v-else>you</span>
            as soon as access opens up.
          </p>
        </div>

        <p class="text-xs text-gray-500">
          Haven't joined the waitlist yet?
          <router-link
            to="/waitlist"
            class="text-indigo-400 hover:text-indigo-300 underline underline-offset-2"
          >
            Sign up here
          </router-link>
          .
        </p>

        <button
          type="button"
          @click="handleSignOut"
          class="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-800 hover:bg-gray-700 text-white text-sm font-medium rounded-lg border border-gray-700 transition-colors cursor-pointer"
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
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
          Sign out
        </button>
      </div>
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
