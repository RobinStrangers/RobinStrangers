import { defaultXVerifyConfig, verifyXRequest, type VerifyTaskId } from '../supabase/functions/_shared/xTaskVerifier.ts'
import { FOLLOW_URL, LIKE_URL, RETWEET_URL } from '../src/config/socialTasks.ts'

const config = {
  ...defaultXVerifyConfig(),
  followUrl: FOLLOW_URL,
  likeUrl: LIKE_URL,
  retweetUrl: RETWEET_URL,
}

function isTaskId(value: unknown): value is VerifyTaskId {
  return value === 'follow' || value === 'like' || value === 'retweet' || value === 'all'
}

function send(res: { statusCode: number; setHeader: (k: string, v: string) => void; end: (b?: string) => void }, status: number, body: unknown) {
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  res.setHeader('Cache-Control', 'no-store')
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  res.end(JSON.stringify(body))
}

export default async function handler(
  req: { method?: string; body?: unknown },
  res: { statusCode: number; setHeader: (k: string, v: string) => void; end: (b?: string) => void },
) {
  if (req.method === 'OPTIONS') {
    send(res, 204, {})
    return
  }
  if (req.method !== 'POST') {
    send(res, 405, { ok: false, verified: false, error: 'Method not allowed.' })
    return
  }

  const raw = req.body
  const payload = (
    typeof raw === 'string' ? (JSON.parse(raw) as unknown) : (raw ?? {})
  ) as { username?: unknown; taskId?: unknown }
  const username = typeof payload.username === 'string' ? payload.username : ''
  if (!isTaskId(payload.taskId)) {
    send(res, 400, { ok: false, verified: false, error: 'Unknown task.' })
    return
  }

  try {
    const result = await verifyXRequest({ username, taskId: payload.taskId }, config)
    send(res, result.verified ? 200 : 409, result)
  } catch {
    send(res, 500, { ok: false, verified: false, error: 'Verification failed. Try again in a moment.' })
  }
}
