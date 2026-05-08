const verysBaseUrl = import.meta.env.VITE_VERYS_BASE_URL
const moneypennyBaseUrl = import.meta.env.VITE_MONEYPENNY_BASE_URL

export const OAUTH2_CONFIG = {
  clientId: import.meta.env.VITE_OAUTH2_CLIENT_ID || 'moneypenny-client',
  redirectUri: `${window.location.origin}/callback`,
  scope: import.meta.env.VITE_OAUTH2_SCOPE || 'openid email',
  verysBaseUrl,
  authorizeEndpoint: `${verysBaseUrl}/authorize`,
  tokenEndpoint: `${verysBaseUrl}/token`,
  revokeEndpoint: `${verysBaseUrl}/token/revoke`,
  endSessionEndpoint: `${verysBaseUrl}/end-session`,
}

export const API_CONFIG = {
  baseUrl: moneypennyBaseUrl,
  backendClientId: import.meta.env.VITE_MONEYPENNY_CLIENT_ID || 'moneypenny',
}
