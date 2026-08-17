import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { TaskId } from '../config/socialTasks'
import { saveWaitlistEntry } from '../lib/waitlist'
import { isValidEvmAddress, normalizeAddress } from '../lib/wallet'
import { isValidXUsername, normalizeXUsername } from '../lib/xUsername'

export const FLOW = {
  INTRO: 'INTRO',
  WAITLIST: 'WAITLIST',
  WAITLIST_SUCCESS: 'WAITLIST_SUCCESS',
  TASK_1: 'TASK_1',
  TASK_2: 'TASK_2',
  TASK_3: 'TASK_3',
  COMPLETED: 'COMPLETED',
} as const

export type FlowState = (typeof FLOW)[keyof typeof FLOW]

export type TaskCompletion = Record<TaskId, boolean>

type FlowContextValue = {
  state: FlowState
  walletAddress: string
  xUsername: string
  tasks: TaskCompletion
  completedCount: number
  enterWorld: () => void
  submitWaitlist: (
    address: string,
    xUsername: string,
  ) => Promise<{ ok: boolean; error?: string }>
  advanceFromSuccess: () => void
  completeTask: (id: TaskId) => void
}

const EMPTY_TASKS: TaskCompletion = {
  follow: false,
  like: false,
  retweet: false,
}

const FlowContext = createContext<FlowContextValue | null>(null)

export function FlowProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<FlowState>(FLOW.INTRO)
  const [walletAddress, setWalletAddress] = useState('')
  const [xUsername, setXUsername] = useState('')
  const [tasks, setTasks] = useState<TaskCompletion>(EMPTY_TASKS)

  const enterWorld = useCallback(() => {
    setState(FLOW.TASK_1)
  }, [])

  const submitWaitlist = useCallback(async (address: string, username: string) => {
    const nextAddress = normalizeAddress(address)
    const nextUsername = normalizeXUsername(username)
    if (!isValidEvmAddress(nextAddress)) {
      return { ok: false, error: 'Enter a valid EVM address.' }
    }
    if (!isValidXUsername(nextUsername)) {
      return { ok: false, error: 'Enter a valid X username.' }
    }

    const saved = await saveWaitlistEntry({
      walletAddress: nextAddress,
      xUsername: nextUsername,
      followed: tasks.follow,
    })
    if (!saved.ok) return saved

    setWalletAddress(nextAddress)
    setXUsername(nextUsername)
    setState(FLOW.COMPLETED)
    return { ok: true }
  }, [tasks.follow])

  const advanceFromSuccess = useCallback(() => {
    setState((current) => (current === FLOW.WAITLIST_SUCCESS ? FLOW.COMPLETED : current))
  }, [])

  const completeTask = useCallback((id: TaskId) => {
    setTasks((current) => {
      if (current[id]) return current
      return { ...current, [id]: true }
    })
    setState((current) => {
      if (id === 'follow' && current === FLOW.TASK_1) return FLOW.WAITLIST
      if (id === 'like' && current === FLOW.TASK_2) return FLOW.TASK_3
      if (id === 'retweet' && current === FLOW.TASK_3) return FLOW.WAITLIST
      return current
    })
  }, [])

  const completedCount = Number(tasks.follow) + Number(tasks.like) + Number(tasks.retweet)

  const value = useMemo<FlowContextValue>(
    () => ({
      state,
      walletAddress,
      xUsername,
      tasks,
      completedCount,
      enterWorld,
      submitWaitlist,
      advanceFromSuccess,
      completeTask,
    }),
    [
      state,
      walletAddress,
      xUsername,
      tasks,
      completedCount,
      enterWorld,
      submitWaitlist,
      advanceFromSuccess,
      completeTask,
    ],
  )

  return <FlowContext.Provider value={value}>{children}</FlowContext.Provider>
}

export function useFlow() {
  const context = useContext(FlowContext)
  if (!context) {
    throw new Error('useFlow must be used within FlowProvider')
  }
  return context
}
