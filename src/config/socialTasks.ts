export const FOLLOW_URL = 'https://x.com/robinstrangers'
export const LIKE_URL = ''
export const RETWEET_URL = ''

export type TaskId = 'follow' | 'like' | 'retweet'

export type SocialTask = {
  id: TaskId
  number: string
  title: string
  description: string
  cta: string
  url: string
  available: boolean
}

export const SOCIAL_TASKS: SocialTask[] = [
  {
    id: 'follow',
    number: '01',
    title: 'FOLLOW X',
    description: 'Follow Strangers on X',
    cta: 'FOLLOW',
    url: FOLLOW_URL,
    available: true,
  },
  {
    id: 'like',
    number: '02',
    title: 'LIKE POST',
    description: 'Like the latest Strangers post on X',
    cta: 'LIKE',
    url: LIKE_URL,
    available: true,
  },
  {
    id: 'retweet',
    number: '03',
    title: 'RETWEET POST',
    description: 'Retweet the latest Strangers post on X',
    cta: 'RETWEET',
    url: RETWEET_URL,
    available: true,
  },
]

export function getTaskUrl(task: SocialTask): string {
  return task.url.trim()
}

export function isTaskAvailable(task: SocialTask): boolean {
  return task.available
}
