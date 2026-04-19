function base64urlEncode(buffer) {
  const bytes = new Uint8Array(buffer)
  let str = ''
  for (const b of bytes) str += String.fromCharCode(b)
  return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

export function generateCodeVerifier() {
  const bytes = crypto.getRandomValues(new Uint8Array(32))
  return base64urlEncode(bytes)
}

export async function generateCodeChallenge(verifier) {
  const encoded = new TextEncoder().encode(verifier)
  const hash = await crypto.subtle.digest('SHA-256', encoded)
  return base64urlEncode(hash)
}

export function generateState() {
  const bytes = crypto.getRandomValues(new Uint8Array(16))
  return base64urlEncode(bytes)
}
