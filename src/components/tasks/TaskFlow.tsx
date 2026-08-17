import { SOCIAL_TASKS } from '../../config/socialTasks'
import { useTaskProgress } from '../../hooks/useTaskProgress'
import { TaskItem } from './TaskItem'
import { TaskProgress } from './TaskProgress'

export function TaskFlow() {
  const { tasks, completedCount, total, completeTask, isUnlocked, isCurrent } = useTaskProgress()

  return (
    <div className="flex flex-col gap-4">
      <TaskProgress
        completed={completedCount}
        total={total}
        current={completedCount === total ? total : completedCount + 1}
      />
      <div className="flex flex-col gap-3">
        {SOCIAL_TASKS.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            completed={tasks[task.id]}
            current={isCurrent(task.id)}
            locked={!isUnlocked(task.id) && !tasks[task.id]}
            onComplete={() => completeTask(task.id)}
          />
        ))}
      </div>
    </div>
  )
}
