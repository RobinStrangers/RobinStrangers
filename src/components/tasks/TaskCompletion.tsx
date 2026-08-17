import { shortenAddress } from '../../lib/wallet'
import { useFlow } from '../../state/FlowContext'

export function TaskCompletion() {
  const { walletAddress } = useFlow()

  return (
    <div className="youre-in flex flex-col items-center gap-4 py-3 text-center">
      <p className="font-display text-6xl leading-none tracking-wide text-[#FC6224] sm:text-7xl">
        YOU'RE IN
      </p>
      <p className="font-mono text-sm tracking-[0.12em] text-[#FC6224]">
        {shortenAddress(walletAddress)}
      </p>
    </div>
  )
}
