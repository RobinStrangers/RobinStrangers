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
}

export const SOCIAL_TASKS: SocialTask[] = [
  {
    id: 'follow',
    number: '01',
    title: 'FOLLOW X',
    description: 'Follow Strangers on X',
    cta: 'FOLLOW',
    url: FOLLOW_URL,
  },
  {
    id: 'like',
    number: '02',
    title: 'LIKE POST',
    description: 'Like the latest Strangers post on X',
    cta: 'LIKE',
    url: LIKE_URL,
  },
  {
    id: 'retweet',
    number: '03',
    title: 'RETWEET POST',
    description: 'Retweet the latest Strangers post on X.',
    cta: 'RETWEET',
    url: RETWEET_URL,
  },
]

export function extractXHandle(url: string): string {
  const match = url
    .trim()
    .match(/(?:x\.com|twitter\.com)\/(?:intent\/(?:user|follow)\?screen_name=)?@?([A-Za-z0-9_]+)/i)
  if (!match) return ''
  const handle = match[1]
  const reserved = new Set(['intent', 'i', 'home', 'explore', 'search', 'share', 'hashtag', 'compose'])
  return reserved.has(handle.toLowerCase()) ? '' : handle
}

export function extractTweetId(url: string): string {
  return url.trim().match(/status(?:es)?\/(\d+)/i)?.[1] ?? url.trim().match(/tweet_id=(\d+)/i)?.[1] ?? ''
}

export const X_TARGET_HANDLE = extractXHandle(FOLLOW_URL) || 'robinstrangers'

export function getTaskUrl(task: SocialTask): string {
  return task.url.trim()
}
