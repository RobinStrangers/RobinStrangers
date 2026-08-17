import { SOCIAL_TASKS, getTaskUrl } from '../../config/socialTasks'
import { useTaskProgress } from '../../hooks/useTaskProgress'
import { isValidXUsername, normalizeXUsername } from '../../lib/xUsername'
import { useFlow } from '../../state/FlowContext'
import { Input } from '../ui/Input'
import { TaskItem } from './TaskItem'
import { TaskProgress } from './TaskProgress'

export function TaskFlow() {
  const { tasks, completedCount, total, verifyTask, isUnlocked, isCurrent } = useTaskProgress()
  const { xUsername, setXUsername } = useFlow()

  const usernameValid = isValidXUsername(xUsername)

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
        {SOCIAL_TASKS.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            completed={tasks[task.id]}
            current={isCurrent(task.id)}
            locked={!isUnlocked(task.id) && !tasks[task.id]}
            actionUrl={getTaskUrl(task)}
            onVerify={() => verifyTask(task.id)}
          />
        ))}
      </div>
    </div>
  )
}
