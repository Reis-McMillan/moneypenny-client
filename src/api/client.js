import { OAUTH2_CONFIG, API_CONFIG } from '../config.js'
import { isTokenExpired } from '../lib/jwt.js'

const API_BASE = API_CONFIG.baseUrl

let refreshInFlight = null
let exchangeInFlight = null

function setTokens({ access_token, refresh_token, id_token, exchanged_token }) {
  if (access_token) localStorage.setItem('access_token', access_token)
  if (refresh_token) localStorage.setItem('refresh_token', refresh_token)
  if (id_token) localStorage.setItem('id_token', id_token)
  if (exchanged_token) localStorage.setItem('exchanged_token', exchanged_token)
}

function clearTokens() {
  localStorage.removeItem('access_token')
  localStorage.removeItem('refresh_token')
  localStorage.removeItem('id_token')
  localStorage.removeItem('exchanged_token')
}

function getTokens() {
  return {
    accessToken: localStorage.getItem('access_token'),
    refreshToken: localStorage.getItem('refresh_token'),
    idToken: localStorage.getItem('id_token'),
    exchangedToken: localStorage.getItem('exchanged_token'),
  }
}

async function ensureValidToken(token) {
  if (!token || !isTokenExpired(token)) return token

  const { accessToken, exchangedToken } = getTokens()
  if (token === accessToken) {
    if (await refreshAccessToken()) return getTokens().accessToken
  } else if (token === exchangedToken) {
    if (await exchangeToken()) return getTokens().exchangedToken
  }
  return null
}

async function isTokenError(response) {
  if (response.status !== 400) return false
  const body = await response.clone().json().catch(() => ({}))
  return body.detail === 'Invalid auth token.'
}

async function refreshAccessToken() {
  if (refreshInFlight) return refreshInFlight
  refreshInFlight = (async () => {
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
      // probably should redirect back to verification
    }

    clearTokens()
    return false
  })().finally(() => { refreshInFlight = null })
  return refreshInFlight
}

function buildAuthInitParams(returnUrl) {
  const params = { return_url: returnUrl }
  return new URLSearchParams(params).toString()
}

async function exchangeToken(returnUrl = window.location.pathname + window.location.search) {
  if (exchangeInFlight) return exchangeInFlight
  exchangeInFlight = (async () => {
    let { accessToken } = getTokens()
    if (!accessToken) return false

    accessToken = await ensureValidToken(accessToken)
    if (!accessToken) return false

    const params = new URLSearchParams()
    params.set('grant_type', 'urn:ietf:params:oauth:grant-type:token-exchange')
    params.set('client_id', OAUTH2_CONFIG.clientId)
    params.set('subject_token', accessToken)
    params.set('subject_token_type', 'urn:ietf:params:oauth:token-type:access_token')
    params.set('audience', API_CONFIG.backendClientId)

    let res
    try {
      res = await fetch(OAUTH2_CONFIG.tokenEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params,
      })
    } catch {
      return false
    }

    if (res.ok) {
      const data = await res.json()
      setTokens({ exchanged_token: data.access_token })
      return true
    }

    if (res.status === 403) {
      const details = await res.json().catch(() => ({}))
      if (details.error_description === 'User has not consented to target client.') {
        const queryString = buildAuthInitParams(returnUrl)
        window.location.href = `${API_BASE}/auth/initialize?${queryString}`
      }
    }

    return false
  })().finally(() => { exchangeInFlight = null })
  return exchangeInFlight
}

async function request(path, options = {}, origin = window.location.href) {
  await ensureValidToken(getTokens().exchangedToken)

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

  if (await isTokenError(response)) {
    const refreshed = await refreshAccessToken()
    if (refreshed) {
      const exchanged = await exchangeToken(origin)
      if (exchanged) {
        const { exchangedToken: newToken } = getTokens()
        headers['Authorization'] = `Bearer ${newToken}`
        response = await fetch(url, { ...options, headers })
      }
    }
  }

  if (response.status === 403) {
    const data = await response.clone().json().catch(() => ({}))
    if (data.setup_required && data.redirect_url) {
      const queryString = buildAuthInitParams(origin)
      window.location.href = `${data.redirect_url}?${queryString}`
    }
  }

  return response
}

async function streamPost(path, body, origin = window.location.href) {
  await ensureValidToken(getTokens().exchangedToken)

  const url = `${API_BASE}${path}`
  const { exchangedToken } = getTokens()

  let response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(exchangedToken ? { 'Authorization': `Bearer ${exchangedToken}` } : {}),
    },
    body: JSON.stringify(body),
  })

  if (await isTokenError(response)) {
    if (await refreshAccessToken()) {
      if (await exchangeToken(origin)) {
        const { exchangedToken: newToken } = getTokens()
        response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(newToken ? { 'Authorization': `Bearer ${newToken}` } : {}),
          },
          body: JSON.stringify(body),
        })
      }
    }
  }

  if (response.status === 403) {
    const data = await response.clone().json().catch(() => ({}))
    if (data.setup_required && data.redirect_url) {
      const queryString = buildAuthInitParams(origin)
      window.location.href = `${data.redirect_url}?${queryString}`
    }
  }

  return response
}

const api = {
  get: (path) => request(path),
  post: (path, body) => request(path, { method: 'POST', body }),
  put: (path, body) => request(path, { method: 'PUT', body }),
  delete: (path) => request(path, { method: 'DELETE' }),
}

export { api, setTokens, clearTokens, getTokens, exchangeToken, streamPost }
