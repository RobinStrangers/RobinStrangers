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
    description: 'A post is not live yet',
    cta: 'LIKE',
    url: LIKE_URL,
    available: false,
  },
  {
    id: 'retweet',
    number: '03',
    title: 'RETWEET POST',
    description: 'A post is not live yet',
    cta: 'RETWEET',
    url: RETWEET_URL,
    available: false,
  },
]

export function getTaskUrl(task: SocialTask): string {
  return task.url
}

export function isTaskAvailable(task: SocialTask): boolean {
  return task.available && Boolean(task.url)
}
