import { createRouter, createWebHistory } from 'vue-router'
import { useAuth } from '../composables/useAuth.js'

import LoginView from '../views/LoginView.vue'
import CallbackView from '../views/CallbackView.vue'
import SetupCompleteView from '../views/SetupCompleteView.vue'
import LogoutView from '../views/LogoutView.vue'
import ChatView from '../views/ChatView.vue'
import AccountsView from '../views/AccountsView.vue'

const routes = [
  { path: '/', redirect: '/chat' },
  { path: '/login', name: 'Login', component: LoginView, meta: { guest: true } },
  { path: '/callback', name: 'Callback', component: CallbackView },
  { path: '/setup-complete', name: 'SetupComplete', component: SetupCompleteView },
  { path: '/chat', name: 'Chat', component: ChatView, meta: { auth: true } },
  { path: '/chat/:threadId', name: 'ChatThread', component: ChatView, meta: { auth: true } },
  { path: '/accounts', name: 'Accounts', component: AccountsView, meta: { auth: true } },
  { path: '/logout', name: 'Logout', component: LogoutView },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach(async (to) => {
  if (to.name === 'Callback' || to.name === 'SetupComplete') return

  const { isAuthenticated, loading, fetchUser } = useAuth()

  if (loading.value && !isAuthenticated.value) {
    await fetchUser()
  }

  if (to.meta.auth && !isAuthenticated.value) {
    return { name: 'Login' }
  }

  if (to.meta.guest && isAuthenticated.value) {
    return { name: 'Chat' }
  }
})

export default router
