export function decodeJwtPayload(token) {
  try {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
    return JSON.parse(atob(base64))
  } catch {
    return null
  }
}

export function isTokenExpired(token, bufferSeconds = 60) {
  const payload = decodeJwtPayload(token)
  if (!payload || !payload.exp) return true
  const nowSeconds = Math.floor(Date.now() / 1000)
  return payload.exp - nowSeconds < bufferSeconds
}
