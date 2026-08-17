import { defaultXVerifyConfig, resolveXTarget } from '../supabase/functions/_shared/xTaskVerifier.ts'
import { FOLLOW_URL, LIKE_URL, RETWEET_URL } from '../src/config/socialTasks.ts'

const config = {
  ...defaultXVerifyConfig(),
  followUrl: FOLLOW_URL,
  likeUrl: LIKE_URL,
  retweetUrl: RETWEET_URL,
}

function send(res: { statusCode: number; setHeader: (k: string, v: string) => void; end: (b?: string) => void }, status: number, body: unknown) {
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  res.setHeader('Cache-Control', 'no-store')
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  res.end(JSON.stringify(body))
}

export default async function handler(
  req: { method?: string },
  res: { statusCode: number; setHeader: (k: string, v: string) => void; end: (b?: string) => void },
) {
  if (req.method === 'OPTIONS') {
    send(res, 204, {})
    return
  }
  if (req.method !== 'GET') {
    send(res, 405, { error: 'Method not allowed.' })
    return
  }

  try {
    send(res, 200, await resolveXTarget(config))
  } catch {
    send(res, 500, { error: 'Could not resolve X targets.' })
  }
}
