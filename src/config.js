const verysBaseUrl = import.meta.env.VITE_VERYS_BASE_URL || '/auth'
const verysProxyUrl = import.meta.env.VITE_VERYS_PROXY_URL || verysBaseUrl
const moneypennyBaseUrl = import.meta.env.VITE_MONEYPENNY_BASE_URL || '/api'

export const OAUTH2_CONFIG = {
  clientId: import.meta.env.VITE_OAUTH2_CLIENT_ID || 'moneypenny-client',
  redirectUri: `${window.location.origin}/callback`,
  scope: import.meta.env.VITE_OAUTH2_SCOPE || 'openid email',
  verysBaseUrl,
  authorizeEndpoint: `${verysBaseUrl}/authorize`,
  tokenEndpoint: `${verysProxyUrl}/token`,
  revokeEndpoint: `${verysProxyUrl}/token/revoke`,
  endSessionEndpoint: `${verysBaseUrl}/end-session`,
}

export const API_CONFIG = {
  baseUrl: moneypennyBaseUrl,
  backendClientId: import.meta.env.VITE_MONEYPENNY_CLIENT_ID || 'moneypenny',
}
