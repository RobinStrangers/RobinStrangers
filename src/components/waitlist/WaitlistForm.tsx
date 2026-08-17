import { useState, type FormEvent } from 'react'
import { isValidEvmAddress, normalizeAddress } from '../../lib/wallet'
import { isValidXUsername, normalizeXUsername } from '../../lib/xUsername'
import { useFlow } from '../../state/FlowContext'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { WalletAddressInput } from './WalletAddressInput'

export function WaitlistForm() {
  const { submitWaitlist } = useFlow()
  const [address, setAddress] = useState('')
  const [xUsername, setXUsername] = useState('')
  const [attempted, setAttempted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const addressValid = isValidEvmAddress(normalizeAddress(address))
  const usernameValid = isValidXUsername(xUsername)
  const valid = addressValid && usernameValid

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setAttempted(true)
    setError('')
    if (!valid) return
    setSubmitting(true)
    const result = await submitWaitlist(address, xUsername)
    setSubmitting(false)
    if (!result.ok) {
      setError(result.error ?? 'Could not join the waitlist.')
    }
  }

  return (
    <form className="flex flex-col gap-4" onSubmit={onSubmit} noValidate>
      <WalletAddressInput value={address} onChange={setAddress} showError={attempted} />
      <Input
        label="USERNAME X"
        name="x-username"
        id="x-username"
        value={xUsername}
        placeholder="@username"
        autoComplete="off"
        spellCheck={false}
        success={usernameValid}
        error={
          attempted && !usernameValid
            ? 'Enter your X username, 1-15 letters, numbers, or _.'
            : !xUsername || usernameValid
              ? undefined
              : 'Invalid X username.'
        }
        onChange={(event) => setXUsername(normalizeXUsername(event.target.value))}
      />
      {error ? (
        <p role="alert" className="text-[11px] tracking-wide text-[#FC6224]">
          {error}
        </p>
      ) : null}
      <Button type="submit" variant="primary" disabled={!valid || submitting} className="w-full">
        {submitting ? 'SAVING' : 'Confirm'}
      </Button>
    </form>
  )
}
