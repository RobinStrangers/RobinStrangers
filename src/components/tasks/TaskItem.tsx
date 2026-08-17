import { useState } from 'react'
import type { SocialTask } from '../../config/socialTasks'
import { getTaskUrl } from '../../config/socialTasks'
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

  const openAction = () => {
    const url = (actionUrl ?? getTaskUrl(task)).trim()
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer')
    }
    setOpened(true)
  }

  const verifyAction = () => {
    void onVerify()
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
      className={`task-item ${current ? 'is-current' : ''} ${completed ? 'is-complete' : ''} ${locked ? 'is-locked' : ''}`}
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
            <Button variant="task" onClick={openAction}>
              {task.cta}
            </Button>
            {opened ? (
              <Button variant="ghost" className="!px-3 !py-1.5 !text-[10px]" onClick={verifyAction}>
                VERIFY
              </Button>
            ) : null}
          </div>
        ) : null}
      </div>
    </article>
  )
}
