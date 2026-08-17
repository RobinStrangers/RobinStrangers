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
import { verifyXTask } from '../lib/xVerify'
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
  setXUsername: (value: string) => void
  submitWaitlist: (
    address: string,
    xUsername: string,
  ) => Promise<{ ok: boolean; error?: string }>
  advanceFromSuccess: () => void
  verifyTask: (id: TaskId) => Promise<{ ok: boolean; error?: string }>
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

  const updateXUsername = useCallback((value: string) => {
    setXUsername(normalizeXUsername(value))
  }, [])

  const markTaskComplete = useCallback((id: TaskId, nextState?: FlowState) => {
    setTasks((current) => {
      if (current[id]) return current
      return { ...current, [id]: true }
    })
    setState((current) => {
      if (nextState) return nextState
      if (id === 'follow' && current === FLOW.TASK_1) return FLOW.TASK_2
      if (id === 'like' && current === FLOW.TASK_2) return FLOW.TASK_3
      if (id === 'retweet' && current === FLOW.TASK_3) return FLOW.WAITLIST
      return current
    })
  }, [])

  const verifyTask = useCallback(async (id: TaskId) => {
    const username = normalizeXUsername(xUsername)
    if (!isValidXUsername(username)) {
      return { ok: false, error: 'Enter your X username to verify this task.' }
    }

    const result = await verifyXTask({ username, taskId: id })
    if (!result.verified) {
      return { ok: false, error: result.error ?? 'Verification rejected.' }
    }

    const skipRemaining = id === 'follow' && !result.target?.tweetId
    markTaskComplete(id, skipRemaining ? FLOW.WAITLIST : undefined)
    return { ok: true }
  }, [markTaskComplete, xUsername])

  const submitWaitlist = useCallback(async (address: string, username: string) => {
    const nextAddress = normalizeAddress(address)
    const nextUsername = normalizeXUsername(username)
    if (!isValidEvmAddress(nextAddress)) {
      return { ok: false, error: 'Enter a valid EVM address.' }
    }
    if (!isValidXUsername(nextUsername)) {
      return { ok: false, error: 'Enter a valid X username.' }
    }

    const verified = await verifyXTask({ username: nextUsername, taskId: 'all' })
    if (!verified.verified) {
      return { ok: false, error: verified.error ?? 'X verification was rejected.' }
    }

    const saved = await saveWaitlistEntry({
      walletAddress: nextAddress,
      xUsername: nextUsername,
      followed: true,
    })
    if (!saved.ok) return saved

    setWalletAddress(nextAddress)
    setXUsername(nextUsername)
    setState(FLOW.COMPLETED)
    return { ok: true }
  }, [])

  const advanceFromSuccess = useCallback(() => {
    setState((current) => (current === FLOW.WAITLIST_SUCCESS ? FLOW.COMPLETED : current))
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
      setXUsername: updateXUsername,
      submitWaitlist,
      advanceFromSuccess,
      verifyTask,
    }),
    [
      state,
      walletAddress,
      xUsername,
      tasks,
      completedCount,
      enterWorld,
      updateXUsername,
      submitWaitlist,
      advanceFromSuccess,
      verifyTask,
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
