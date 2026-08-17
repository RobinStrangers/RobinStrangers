const X_PATTERN = /^[A-Za-z0-9_]{1,15}$/

export function normalizeXUsername(value: string): string {
  return value.trim().replace(/^@+/, '')
}

export function isValidXUsername(value: string): boolean {
  return X_PATTERN.test(normalizeXUsername(value))
}
