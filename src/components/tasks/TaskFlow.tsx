import { useEffect, useState } from 'react'
import { SOCIAL_TASKS } from '../../config/socialTasks'
import { useTaskProgress } from '../../hooks/useTaskProgress'
import { resolveXTargets, type XVerifyTarget } from '../../lib/xVerify'
import { isValidXUsername, normalizeXUsername } from '../../lib/xUsername'
import { useFlow } from '../../state/FlowContext'
import { Input } from '../ui/Input'
import { TaskItem } from './TaskItem'
import { TaskProgress } from './TaskProgress'

export function TaskFlow() {
  const { tasks, completedCount, total, verifyTask, isUnlocked, isCurrent } = useTaskProgress()
  const { xUsername, setXUsername } = useFlow()
  const [targets, setTargets] = useState<XVerifyTarget | null>(null)

  useEffect(() => {
    let active = true
    void resolveXTargets().then((next) => {
      if (active && next) setTargets(next)
    })
    return () => {
      active = false
    }
  }, [])

  const usernameValid = isValidXUsername(xUsername)
  const actionUrl = (id: (typeof SOCIAL_TASKS)[number]['id']) => {
    if (!targets) return undefined
    if (id === 'follow') return targets.followUrl
    if (id === 'like') return targets.likeUrl
    return targets.retweetUrl
  }

  return (
    <div className="flex flex-col gap-4">
      <TaskProgress
        completed={completedCount}
        total={total}
        current={completedCount === total ? total : completedCount + 1}
      />
      <Input
        label="YOUR X USERNAME"
        name="verify-x-username"
        id="verify-x-username"
        value={xUsername}
        placeholder="@username"
        autoComplete="off"
        spellCheck={false}
        success={usernameValid}
        onChange={(event) => setXUsername(normalizeXUsername(event.target.value))}
      />
      <div className="flex flex-col gap-3">
        {SOCIAL_TASKS.map((task) => {
          const available = task.id === 'follow' || Boolean(targets?.tweetId || task.url.trim())
          return (
            <TaskItem
              key={task.id}
              task={{ ...task, available }}
              completed={tasks[task.id]}
              current={isCurrent(task.id)}
              locked={!isUnlocked(task.id) && !tasks[task.id]}
              actionUrl={actionUrl(task.id)}
              onVerify={() => verifyTask(task.id)}
            />
          )
        })}
      </div>
    </div>
  )
}
