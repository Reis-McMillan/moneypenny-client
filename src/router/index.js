import { createRouter, createWebHistory } from 'vue-router'
import { useAuth } from '../composables/useAuth.js'

import LoginView from '../views/LoginView.vue'
import CallbackView from '../views/CallbackView.vue'
import LogoutView from '../views/LogoutView.vue'
import ChatView from '../views/ChatView.vue'
import AccountsView from '../views/AccountsView.vue'
import IngestionView from '../views/IngestionView.vue'
import PrivacyPolicyView from '../views/PrivacyPolicyView.vue'
import AITransparencyView from '../views/AITransparencyView.vue'
import TermsOfServiceView from '../views/TermsOfServiceView.vue'

const routes = [
  { path: '/', redirect: '/chat' },
  { path: '/login', name: 'Login', component: LoginView, meta: { guest: true } },
  { path: '/callback', name: 'Callback', component: CallbackView },
  { path: '/chat', name: 'Chat', component: ChatView, meta: { auth: true } },
  { path: '/chat/:threadId', name: 'ChatThread', component: ChatView, meta: { auth: true } },
  { path: '/accounts', name: 'Accounts', component: AccountsView, meta: { auth: true } },
  { path: '/ingestion', name: 'Ingestion', component: IngestionView, meta: { auth: true } },
  { path: '/privacy', name: 'Privacy', component: PrivacyPolicyView },
  { path: '/ai-transparency', name: 'AITransparency', component: AITransparencyView },
  { path: '/terms', name: 'Terms', component: TermsOfServiceView },
  { path: '/logout', name: 'Logout', component: LogoutView },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach(async (to) => {
  if (to.name === 'Callback') return

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
