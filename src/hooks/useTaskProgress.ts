import { SOCIAL_TASKS, type TaskId } from '../config/socialTasks'
import { FLOW, useFlow } from '../state/FlowContext'

export function useTaskProgress() {
  const { tasks, completedCount, completeTask, state } = useFlow()

  const currentIndex =
    state === FLOW.TASK_1 ? 0 : state === FLOW.TASK_2 ? 1 : state === FLOW.TASK_3 ? 2 : completedCount === 3 ? 3 : 0

  const currentTask = SOCIAL_TASKS[Math.min(currentIndex, SOCIAL_TASKS.length - 1)]

  const isUnlocked = (id: TaskId) => {
    if (id === 'follow') return state === FLOW.TASK_1 || tasks.follow
    if (id === 'like') return state === FLOW.TASK_2 || tasks.like
    return state === FLOW.TASK_3 || tasks.retweet
  }

  const isCurrent = (id: TaskId) => {
    if (id === 'follow') return state === FLOW.TASK_1
    if (id === 'like') return state === FLOW.TASK_2
    return state === FLOW.TASK_3
  }

  return {
    tasks,
    completedCount,
    total: SOCIAL_TASKS.length,
    currentIndex,
    currentTask,
    completeTask,
    isUnlocked,
    isCurrent,
  }
}
