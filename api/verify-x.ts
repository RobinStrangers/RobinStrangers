import { siteXVerifyConfig } from '../server/xVerifyConfig.ts'
import { verifyXRequest, type VerifyTaskId } from '../supabase/functions/_shared/xTaskVerifier.ts'

export const config = { maxDuration: 15 }

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Cache-Control': 'no-store',
}

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...cors, 'Content-Type': 'application/json; charset=utf-8' },
  })
}

function isTaskId(value: unknown): value is VerifyTaskId {
  return value === 'follow' || value === 'like' || value === 'retweet' || value === 'all'
}

export function OPTIONS(): Response {
  return new Response(null, { status: 204, headers: cors })
}

export async function POST(request: Request): Promise<Response> {
  const payload = (await request.json().catch(() => null)) as
    | { username?: unknown; taskId?: unknown }
    | null
  const username = typeof payload?.username === 'string' ? payload.username : ''
  if (!isTaskId(payload?.taskId)) {
    return json({ ok: false, verified: false, error: 'Unknown task.' }, 400)
  }

  try {
    const result = await verifyXRequest({ username, taskId: payload.taskId }, siteXVerifyConfig())
    return json(result, result.verified ? 200 : 409)
  } catch {
    return json(
      { ok: false, verified: false, error: 'Verification failed. Try again in a moment.' },
      500,
    )
  }
}
