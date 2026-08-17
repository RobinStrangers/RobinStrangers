import { TaskCompletion } from '../components/tasks/TaskCompletion'
import { WaitlistForm } from '../components/waitlist/WaitlistForm'
import { LivingWorld } from '../components/world/LivingWorld'
import { FLOW, useFlow } from '../state/FlowContext'

export function Waitlist() {
  const { state } = useFlow()

  return (
    <main className="app-shell">
      <LivingWorld />
      <div className="waitlist-page">
        <section className="waitlist-card" aria-live="polite">
          <header className="mb-6">
            <p className="font-display text-4xl leading-none tracking-[0.14em] text-[#FC6224]">
              STRANGERS
            </p>
            <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#FC6224]/75">
              Waitlist
            </p>
          </header>
          {state === FLOW.COMPLETED ? <TaskCompletion /> : <WaitlistForm />}
        </section>
      </div>
    </main>
  )
}
