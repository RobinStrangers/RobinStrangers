const EVM_PATTERN = /^0x[a-fA-F0-9]{40}$/

export function normalizeAddress(value: string): string {
  return value.trim().toLowerCase()
}

export function isValidEvmAddress(value: string): boolean {
  return EVM_PATTERN.test(normalizeAddress(value))
}

export function shortenAddress(value: string): string {
  const address = normalizeAddress(value)
  if (address.length < 10) return address
  return `${address.slice(0, 4)}...${address.slice(-4)}`
}
