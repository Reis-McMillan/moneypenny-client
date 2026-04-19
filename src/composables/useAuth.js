import { reactive, computed } from 'vue'
import { setTokens as storeTokens, clearTokens, getTokens, exchangeToken } from '../api/client.js'
import { generateCodeVerifier, generateCodeChallenge, generateState } from '../lib/pkce.js'
import { decodeJwtPayload } from '../lib/jwt.js'
import { OAUTH2_CONFIG, API_CONFIG } from '../config.js'

const state = reactive({
  user: null,
  loading: true,
})

export function useAuth() {
  const isAuthenticated = computed(() => !!state.user)
  const user = computed(() => state.user)
  const loading = computed(() => state.loading)

  async function fetchUser() {
    state.loading = true
    try {
      const { idToken } = getTokens()
      if (!idToken) {
        state.user = null
        return
      }
      const payload = decodeJwtPayload(idToken)
      if (payload) {
        state.user = { email: payload.email, sub: payload.sub }
      } else {
        state.user = null
      }
    } catch {
      state.user = null
    } finally {
      state.loading = false
    }
  }

  async function startOAuthFlow() {
    const verifier = generateCodeVerifier()
    const challenge = await generateCodeChallenge(verifier)
    const oauthState = generateState()

    sessionStorage.setItem('code_verifier', verifier)
    sessionStorage.setItem('oauth2_state', oauthState)

    const params = new URLSearchParams({
      response_type: 'code',
      client_id: OAUTH2_CONFIG.clientId,
      redirect_uri: OAUTH2_CONFIG.redirectUri,
      scope: OAUTH2_CONFIG.scope,
      code_challenge: challenge,
      code_challenge_method: 'S256',
      state: oauthState,
    })

    window.location.href = `${OAUTH2_CONFIG.authorizeEndpoint}?${params}`
  }

  async function handleCallback(code, returnedState) {
    const savedState = sessionStorage.getItem('oauth2_state')
    if (!savedState || savedState !== returnedState) {
      return { success: false, error: 'Invalid state parameter. Please try signing in again.' }
    }

    const codeVerifier = sessionStorage.getItem('code_verifier')
    if (!codeVerifier) {
      return { success: false, error: 'Missing PKCE verifier. Please try signing in again.' }
    }

    try {
      const params = new URLSearchParams()
      params.set('grant_type', 'authorization_code')
      params.set('code', code)
      params.set('redirect_uri', OAUTH2_CONFIG.redirectUri)
      params.set('client_id', OAUTH2_CONFIG.clientId)
      params.set('code_verifier', codeVerifier)

      const res = await fetch(OAUTH2_CONFIG.tokenEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params,
      })

      if (res.ok) {
        const data = await res.json()
        storeTokens(data)
        sessionStorage.removeItem('code_verifier')
        sessionStorage.removeItem('oauth2_state')

        // Attempt token exchange for backend access.
        // If it fails (no consent yet), ensureBackendSetup will handle the redirect.
        await exchangeToken()
        await fetchUser()
        return { success: true }
      } else {
        const data = await res.json().catch(() => ({}))
        return { success: false, error: data.error_description || data.detail || 'Token exchange failed.' }
      }
    } catch {
      return { success: false, error: 'Network error during authentication.' }
    }
  }

  async function ensureBackendSetup() {
    const { exchangedToken } = getTokens()
    if (exchangedToken) return false

    const exchanged = await exchangeToken()
    if (exchanged) return false

    window.location.href = `${API_CONFIG.baseUrl}/auth/initialize`
    return true
  }

  async function logout() {
    const { refreshToken, idToken } = getTokens()

    if (refreshToken) {
      try {
        await fetch(OAUTH2_CONFIG.revokeEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({ token: refreshToken }),
        })
      } catch {
        // continue logout even if revocation fails
      }
    }

    clearTokens()
    state.user = null

    const params = new URLSearchParams()
    if (idToken) params.set('id_token_hint', idToken)
    params.set('post_logout_redirect_uri', `${window.location.origin}/logout`)

    window.location.href = `${OAUTH2_CONFIG.endSessionEndpoint}?${params}`
  }

  return {
    user,
    loading,
    isAuthenticated,
    fetchUser,
    startOAuthFlow,
    handleCallback,
    ensureBackendSetup,
    logout,
  }
}
