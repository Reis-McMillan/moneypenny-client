<script setup>
import { ref, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth.js'
import { useActions } from '../composables/useActions.js'

const router = useRouter()
const { isAuthenticated, user, logout } = useAuth()
const { hasActions, loadActions } = useActions()
const isCollapsed = ref(false)

async function handleLogout() {
  await logout()
  router.push('/login')
}

onMounted(() => {
  if (isAuthenticated.value) loadActions()
})

watch(isAuthenticated, (val) => {
  if (val) loadActions()
})
</script>

<template>
  <aside
    :class="[
      'h-screen bg-slate-900 text-slate-300 transition-all duration-300 flex flex-col shrink-0 sticky left-0 top-0 z-10',
      isCollapsed ? 'w-20' : 'w-64'
    ]"
  >
    <div class="h-16 flex items-center justify-between px-4 border-b border-slate-800">
      <span v-if="!isCollapsed" class="font-bold text-xl text-white tracking-wider">Moneypenny</span>
      <button
        @click="isCollapsed = !isCollapsed"
        class="p-2 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
        :class="{ 'mx-auto': isCollapsed }"
      >
        <svg class="w-5 h-5 transition-transform" :class="{ 'rotate-180': isCollapsed }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
    </div>

    <nav v-if="isAuthenticated" class="flex-1 flex flex-col gap-1 px-3 py-4 overflow-y-auto">
      <router-link
        to="/chat"
        class="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium hover:text-white hover:bg-slate-800 transition-colors"
      >
        <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        <span v-if="!isCollapsed">Chat</span>
      </router-link>

      <router-link
        to="/accounts"
        class="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium hover:text-white hover:bg-slate-800 transition-colors relative"
      >
        <span class="relative shrink-0">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
          <span
            v-if="hasActions"
            class="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-red-500 ring-2 ring-slate-900"
            aria-label="Re-authorization required"
          />
        </span>
        <span v-if="!isCollapsed" class="flex items-center gap-2">
          Accounts
          <span
            v-if="hasActions"
            class="text-[10px] uppercase tracking-wider text-red-400 font-semibold"
          >
            Reauth
          </span>
        </span>
      </router-link>

      <router-link
        to="/ingestion"
        class="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium hover:text-white hover:bg-slate-800 transition-colors"
      >
        <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
        </svg>
        <span v-if="!isCollapsed">Ingestion</span>
      </router-link>
    </nav>

    <div class="mt-auto border-t border-slate-800 p-4">
      <template v-if="isAuthenticated">
        <div v-if="!isCollapsed" class="text-slate-400 text-sm truncate mb-3">{{ user?.email }}</div>
        <button
          @click="handleLogout"
          class="flex items-center gap-3 w-full px-3 py-2 rounded-md text-sm font-medium hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span v-if="!isCollapsed">Logout</span>
        </button>
      </template>
      <template v-else>
        <router-link
          to="/login"
          class="flex items-center justify-center gap-3 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium px-3 py-2 rounded-md transition-colors"
        >
          <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span v-if="!isCollapsed">Sign In</span>
        </router-link>
      </template>
    </div>
  </aside>
</template>
