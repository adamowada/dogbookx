const sessionKey = 'dogbookx.viewerId'
const defaultViewerId = 'user-maya'

export function getViewerId() {
  if (typeof window === 'undefined') return defaultViewerId

  const existing = window.localStorage.getItem(sessionKey)
  if (existing) return existing

  window.localStorage.setItem(sessionKey, defaultViewerId)
  return defaultViewerId
}
