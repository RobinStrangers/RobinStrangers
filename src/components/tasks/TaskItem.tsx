import { useState } from 'react'
import type { SocialTask } from '../../config/socialTasks'
import { getTaskUrl, isTaskAvailable } from '../../config/socialTasks'
import { Button } from '../ui/Button'

type TaskItemProps = {
  task: SocialTask
  completed: boolean
  current: boolean
  locked: boolean
  actionUrl?: string
  onVerify: () => Promise<{ ok: boolean; error?: string }>
}

export function TaskItem({
  task,
  completed,
  current,
  locked,
  actionUrl,
  onVerify,
}: TaskItemProps) {
  const [opened, setOpened] = useState(false)
  const [verifying, setVerifying] = useState(false)
  const [error, setError] = useState('')
  const available = isTaskAvailable(task)

  const openAction = () => {
    const url = (actionUrl ?? getTaskUrl(task)).trim()
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer')
    }
    setOpened(true)
    setError('')
  }

  const verifyAction = async () => {
    if (verifying) return
    setVerifying(true)
    setError('')
    const result = await onVerify()
    setVerifying(false)
    if (!result.ok) {
      setError(result.error ?? 'Verification rejected.')
    }
  }

  if (!available && !completed) {
    return (
      <article className="task-item task-item-compact is-locked">
        <div className="flex items-center justify-between gap-3">
          <p className="font-mono text-[10px] tracking-[0.2em] text-[#FC6224]">
            {task.number}  {task.title}
          </p>
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#FC6224]/70">
            COMING SOON
          </p>
        </div>
      </article>
    )
  }

  if (!current) {
    return (
      <article
        className={`task-item task-item-compact ${completed ? 'is-complete' : ''} ${locked ? 'is-locked' : ''}`}
      >
        <div className="flex items-center justify-between gap-3">
          <p className="font-mono text-[10px] tracking-[0.2em] text-[#FC6224]">
            {task.number}  {task.title}
          </p>
          {completed ? (
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#FC6224]">
              COMPLETED ✓
            </p>
          ) : null}
        </div>
      </article>
    )
  }

  return (
    <article
      className={`task-item ${current ? 'is-current' : ''} ${completed ? 'is-complete' : ''} ${locked ? 'is-locked' : ''} ${error ? 'is-rejected' : ''}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-mono text-[10px] tracking-[0.22em] text-[#FC6224]">{task.number}</p>
          <h3 className="mt-1 font-display text-2xl leading-none tracking-wide text-[#FC6224]">
            {task.title}
          </h3>
          {completed ? (
            <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#FC6224]">
              COMPLETED ✓
            </p>
          ) : (
            <p className="mt-2 text-[12px] text-[#FC6224]/75">{task.description}</p>
          )}
        </div>
        {!completed && current ? (
          <div className="flex shrink-0 flex-col items-end gap-2">
            <Button variant="task" onClick={openAction} disabled={verifying}>
              {task.cta}
            </Button>
            {opened ? (
              <Button
                variant="ghost"
                className="!px-3 !py-1.5 !text-[10px]"
                onClick={() => void verifyAction()}
                disabled={verifying}
              >
                {verifying ? 'CHECKING' : error ? 'RETRY' : 'VERIFY'}
              </Button>
            ) : null}
          </div>
        ) : null}
      </div>
      {error && current && !completed ? (
        <p role="alert" className="task-verify-error mt-3 text-[11px] tracking-wide text-[#FC6224]">
          {error}
        </p>
      ) : null}
    </article>
  )
}
