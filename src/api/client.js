import { OAUTH2_CONFIG, API_CONFIG } from '../config.js'
import { isTokenExpired } from '../lib/jwt.js'

const AUTH_BASE = OAUTH2_CONFIG.verysBaseUrl
const API_BASE = API_CONFIG.baseUrl

export function setTokens({ access_token, refresh_token, id_token, exchanged_token }) {
  if (access_token) localStorage.setItem('access_token', access_token)
  if (refresh_token) localStorage.setItem('refresh_token', refresh_token)
  if (id_token) localStorage.setItem('id_token', id_token)
  if (exchanged_token) localStorage.setItem('exchanged_token', exchanged_token)
}

export function clearTokens() {
  localStorage.removeItem('access_token')
  localStorage.removeItem('refresh_token')
  localStorage.removeItem('id_token')
  localStorage.removeItem('exchanged_token')
}

export function getTokens() {
  return {
    accessToken: localStorage.getItem('access_token'),
    refreshToken: localStorage.getItem('refresh_token'),
    idToken: localStorage.getItem('id_token'),
    exchangedToken: localStorage.getItem('exchanged_token'),
  }
}

async function refreshAccessToken() {
  const { refreshToken } = getTokens()
  if (!refreshToken) return false

  const params = new URLSearchParams()
  params.set('grant_type', 'refresh_token')
  params.set('refresh_token', refreshToken)
  params.set('client_id', OAUTH2_CONFIG.clientId)

  try {
    const res = await fetch(OAUTH2_CONFIG.tokenEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params,
    })

    if (res.ok) {
      const data = await res.json()
      setTokens(data)
      return true
    }
  } catch {
    // refresh failed
  }

  clearTokens()
  return false
}

export async function exchangeToken() {
  let { accessToken } = getTokens()
  if (!accessToken) return false

  if (isTokenExpired(accessToken)) {
    const refreshed = await refreshAccessToken()
    if (!refreshed) return false
    accessToken = getTokens().accessToken
  }

  const params = new URLSearchParams()
  params.set('grant_type', 'urn:ietf:params:oauth:grant-type:token-exchange')
  params.set('client_id', OAUTH2_CONFIG.clientId)
  params.set('subject_token', accessToken)
  params.set('subject_token_type', 'urn:ietf:params:oauth:token-type:access_token')
  params.set('audience', API_CONFIG.backendClientId)

  try {
    const res = await fetch(OAUTH2_CONFIG.tokenEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params,
    })

    if (res.ok) {
      const data = await res.json()
      setTokens({ exchanged_token: data.access_token })
      return true
    }
  } catch {
    // exchange failed
  }

  return false
}

let _refreshPromise = null

async function ensureValidToken() {
  if (_refreshPromise) return _refreshPromise

  const { accessToken, exchangedToken } = getTokens()

  if (!accessToken && !exchangedToken) return

  let accessTokenRefreshed = false
  if (!accessToken || isTokenExpired(accessToken)) {
    _refreshPromise = refreshAccessToken()
    accessTokenRefreshed = await _refreshPromise
    _refreshPromise = null

    if (!accessTokenRefreshed) return
  }

  const { exchangedToken: currentExchanged } = getTokens()
  if (!currentExchanged || isTokenExpired(currentExchanged) || accessTokenRefreshed) {
    _refreshPromise = exchangeToken()
    await _refreshPromise
    _refreshPromise = null
  }
}

async function request(path, options = {}) {
  await ensureValidToken()

  const url = `${API_BASE}${path}`
  const headers = { ...options.headers }

  const { exchangedToken } = getTokens()
  if (exchangedToken) {
    headers['Authorization'] = `Bearer ${exchangedToken}`
  }

  if (options.body && !(options.body instanceof URLSearchParams) && !(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json'
    options.body = JSON.stringify(options.body)
  }

  let response = await fetch(url, { ...options, headers })

  if (response.status === 401) {
    const refreshed = await refreshAccessToken()
    if (refreshed) {
      const exchanged = await exchangeToken()
      if (exchanged) {
        const { exchangedToken: newToken } = getTokens()
        headers['Authorization'] = `Bearer ${newToken}`
        response = await fetch(url, { ...options, headers })
      }
    }
  }

  return response
}

export async function streamPost(path, body) {
  await ensureValidToken()

  const url = `${API_BASE}${path}`
  const { exchangedToken } = getTokens()

  return fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(exchangedToken ? { 'Authorization': `Bearer ${exchangedToken}` } : {}),
    },
    body: JSON.stringify(body),
  })
}

export const api = {
  get: (path) => request(path),
  post: (path, body) => request(path, { method: 'POST', body }),
  put: (path, body) => request(path, { method: 'PUT', body }),
  delete: (path) => request(path, { method: 'DELETE' }),
}
