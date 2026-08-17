import { useEffect } from 'react'
import { shortenAddress } from '../../lib/wallet'
import { useFlow } from '../../state/FlowContext'

export function WaitlistSuccess() {
  const { walletAddress, advanceFromSuccess } = useFlow()

  useEffect(() => {
    const timer = window.setTimeout(() => {
      advanceFromSuccess()
    }, 1200)
    return () => window.clearTimeout(timer)
  }, [advanceFromSuccess])

  return (
    <div className="success-panel flex flex-col items-center gap-3 py-2 text-center">
      <p className="font-display text-4xl tracking-wide text-[#FC6224]">IN</p>
      <p className="font-mono text-sm text-[#FC6224]">{shortenAddress(walletAddress)}</p>
      <p className="text-[10px] uppercase tracking-[0.22em] text-[#FC6224]/70">Confirmed</p>
    </div>
  )
}
