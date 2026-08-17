import { useMemo } from 'react'
import { Input } from '../ui/Input'
import { isValidEvmAddress, normalizeAddress } from '../../lib/wallet'

type WalletAddressInputProps = {
  value: string
  onChange: (value: string) => void
  showError: boolean
}

export function WalletAddressInput({ value, onChange, showError }: WalletAddressInputProps) {
  const normalized = normalizeAddress(value)
  const valid = isValidEvmAddress(normalized)
  const empty = normalized.length === 0
  const error =
    showError && !valid
      ? 'Enter a valid EVM address: 0x followed by 40 hexadecimal characters.'
      : !empty && !valid
        ? 'Invalid EVM address.'
        : undefined

  const success = useMemo(() => valid, [valid])

  return (
    <Input
      label="EVM WALLET ADDRESS"
      name="evm-wallet-address"
      id="evm-wallet-address"
      value={value}
      placeholder="0x..."
      inputMode="text"
      autoComplete="off"
      autoCorrect="off"
      autoCapitalize="off"
      spellCheck={false}
      success={success}
      error={error}
      onChange={(event) => onChange(event.target.value)}
      onPaste={(event) => {
        const text = event.clipboardData.getData('text')
        if (text) {
          event.preventDefault()
          onChange(normalizeAddress(text))
        }
      }}
    />
  )
}
