import { FLOW, useFlow } from '../../state/FlowContext'
import { Button } from '../ui/Button'
import { TaskCompletion } from '../tasks/TaskCompletion'
import { TaskFlow } from '../tasks/TaskFlow'
import { WaitlistForm } from './WaitlistForm'

export function WaitlistFlow() {
  const { state, enterWorld } = useFlow()

  const isCentered =
    state === FLOW.TASK_1 ||
    state === FLOW.TASK_2 ||
    state === FLOW.TASK_3 ||
    state === FLOW.WAITLIST ||
    state === FLOW.COMPLETED

  return (
    <div className={`ui-shell ${isCentered ? 'is-centered' : ''}`}>
      {isCentered ? <div className="ui-world-blur" aria-hidden="true" /> : null}
      <section className="ui-panel" aria-live="polite">
        <header className="mb-5">
          <p className="font-display text-3xl leading-none tracking-[0.14em] text-[#FC6224]">
            STRANGERS
          </p>
        </header>

        {state === FLOW.INTRO ? (
          <div className="flex flex-col gap-5">
            <Button variant="primary" className="w-full" onClick={enterWorld}>
              ENTER STRANGERS
            </Button>
          </div>
        ) : null}

        {state === FLOW.TASK_1 || state === FLOW.TASK_2 || state === FLOW.TASK_3 ? (
          <TaskFlow />
        ) : null}

        {state === FLOW.WAITLIST ? <WaitlistForm /> : null}
        {state === FLOW.COMPLETED ? <TaskCompletion /> : null}
      </section>
    </div>
  )
}
