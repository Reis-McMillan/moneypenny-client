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
import AboutView from '../views/AboutView.vue'
import WaitlistView from '../views/WaitlistView.vue'
import PendingApprovalView from '../views/PendingApprovalView.vue'
import AdminUsersView from '../views/AdminUsersView.vue'

const routes = [
  { path: '/', redirect: '/about' },
  { path: '/login', name: 'Login', component: LoginView, meta: { guest: true } },
  { path: '/callback', name: 'Callback', component: CallbackView },
  { path: '/chat', name: 'Chat', component: ChatView, meta: { requiredRoles: ['test-user'] } },
  { path: '/chat/:threadId', name: 'ChatThread', component: ChatView, meta: { requiredRoles: ['test-user'] } },
  { path: '/accounts', name: 'Accounts', component: AccountsView, meta: { requiredRoles: ['test-user'] } },
  { path: '/ingestion', name: 'Ingestion', component: IngestionView, meta: { requiredRoles: ['test-user'] } },
  { path: '/admin', name: 'Admin', component: AdminUsersView, meta: { requiredRoles: ['admin'] } },
  { path: '/pending', name: 'Pending', component: PendingApprovalView, meta: { auth: true } },
  { path: '/privacy', name: 'Privacy', component: PrivacyPolicyView },
  { path: '/ai-transparency', name: 'AITransparency', component: AITransparencyView },
  { path: '/terms', name: 'Terms', component: TermsOfServiceView },
  { path: '/logout', name: 'Logout', component: LogoutView },
  { path: '/about', name: 'About', component: AboutView },
  { path: '/waitlist', name: 'Waitlist', component: WaitlistView },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach(async (to) => {
  if (to.name === 'Callback') return

  const { isAuthenticated, loading, fetchUser, user } = useAuth()

  if (loading.value && !isAuthenticated.value) {
    await fetchUser()
  }

  if (to.meta.requiredRoles) {
    if (!isAuthenticated.value) {
      return { name: 'Login' }
    }
    const userRoles = user.value?.roles || []
    const hasRequired = to.meta.requiredRoles.some((r) => userRoles.includes(r))
    if (!hasRequired) {
      return to.meta.requiredRoles.includes('test-user')
        ? { name: 'Pending' }
        : { name: 'Chat' }
    }
  }

  if (to.meta.auth && !isAuthenticated.value) {
    return { name: 'Login' }
  }

  if (to.meta.guest && isAuthenticated.value) {
    return { name: 'Chat' }
  }
})

export default router
