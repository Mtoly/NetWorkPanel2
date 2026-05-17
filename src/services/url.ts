const ALLOWED_PROTOCOLS = new Set(['http:', 'https:'])

export const isSafeExternalUrl = (value: string): boolean => {
  if (!value || typeof value !== 'string') return false

  try {
    const parsed = new URL(value)
    return ALLOWED_PROTOCOLS.has(parsed.protocol)
  } catch {
    return false
  }
}

export const safeOpenExternalUrl = (value: string): boolean => {
  if (!isSafeExternalUrl(value)) return false

  window.open(value, '_blank', 'noopener,noreferrer')
  return true
}
