import {
  defaultXVerifyConfig,
  resolveXTarget,
  verifyXRequest,
  type VerifyTaskId,
} from '../_shared/xTaskVerifier.ts'

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
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

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') {
    return new Response('ok', { headers: cors })
  }

  const config = defaultXVerifyConfig()
  const url = new URL(request.url)

  if (request.method === 'GET' && url.pathname.endsWith('/x-targets')) {
    return json(await resolveXTarget(config))
  }

  if (request.method !== 'POST') {
    return json({ ok: false, verified: false, error: 'Method not allowed.' }, 405)
  }

  const payload = (await request.json().catch(() => null)) as
    | { username?: unknown; taskId?: unknown; action?: unknown }
    | null

  if (payload?.action === 'targets' || url.searchParams.get('action') === 'targets') {
    return json(await resolveXTarget(config))
  }

  const username = typeof payload?.username === 'string' ? payload.username : ''
  if (!isTaskId(payload?.taskId)) {
    return json({ ok: false, verified: false, error: 'Unknown task.' }, 400)
  }

  const result = await verifyXRequest({ username, taskId: payload.taskId }, config)
  return json(result, result.verified ? 200 : 409)
})
