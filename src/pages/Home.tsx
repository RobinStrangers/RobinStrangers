import { WaitlistFlow } from '../components/waitlist/WaitlistFlow'
import { LivingWorld } from '../components/world/LivingWorld'

export function Home() {
  return (
    <main className="app-shell">
      <LivingWorld />
      <WaitlistFlow />
    </main>
  )
}

