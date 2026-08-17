import type { TaskId } from '../config/socialTasks'
import { isSupabaseConfigured, getSupabase } from './supabase'
import { isValidXUsername, normalizeXUsername } from './xUsername'

export type XTaskId = TaskId | 'all'

export type XVerifyTarget = {
  handle: string
  tweetId?: string
  tweetUrl?: string
  followUrl: string
  likeUrl: string
  retweetUrl: string
}

export type XVerifyResult = {
  ok: boolean
  verified: boolean
  error?: string
  target?: XVerifyTarget
}

export type XVerifyRequest = {
  username: string
  taskId: XTaskId
}

function headers(extra?: HeadersInit): HeadersInit {
  return { 'Content-Type': 'application/json', Accept: 'application/json', ...extra }
}

function supabaseFunctionHeaders(): HeadersInit {
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim()
  if (!key) return headers()
  return headers({ Authorization: `Bearer ${key}`, apikey: key })
}

async function readResult(response: Response): Promise<XVerifyResult> {
  const payload = (await response.json().catch(() => null)) as XVerifyResult | null
  if (!payload || typeof payload.verified !== 'boolean') {
    return {
      ok: false,
      verified: false,
      error: 'Verification service returned an invalid response.',
    }
  }
  return payload
}

function isJsonResponse(response: Response): boolean {
  return (response.headers.get('content-type') ?? '').includes('application/json')
}

async function postVerify(
  url: string,
  body: XVerifyRequest,
  requestHeaders: HeadersInit = headers(),
): Promise<XVerifyResult | null> {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: requestHeaders,
      body: JSON.stringify(body),
    })
    if (response.status === 404 || !isJsonResponse(response)) return null
    return await readResult(response)
  } catch {
    return null
  }
}

async function verifyViaLocalApi(body: XVerifyRequest): Promise<XVerifyResult | null> {
  return postVerify('/api/verify-x', body)
}

async function verifyViaConfiguredUrl(body: XVerifyRequest): Promise<XVerifyResult | null> {
  const url = import.meta.env.VITE_X_VERIFY_URL?.trim()
  if (!url) return null
  return postVerify(url, body)
}

async function verifyViaSupabase(body: XVerifyRequest): Promise<XVerifyResult | null> {
  const base = import.meta.env.VITE_SUPABASE_URL?.trim()
  if (!base) return null
  const fromUrl = await postVerify(
    new URL('/functions/v1/verify-x-task', `${base}/`).toString(),
    body,
    supabaseFunctionHeaders(),
  )
  if (fromUrl) return fromUrl

  if (!isSupabaseConfigured) return null
  try {
    const { data } = await getSupabase().functions.invoke('verify-x-task', { body })
    const payload = data as XVerifyResult | null
    if (!payload || typeof payload.verified !== 'boolean') return null
    return payload
  } catch {
    return null
  }
}

export async function verifyXTask(input: XVerifyRequest): Promise<XVerifyResult> {
  const username = normalizeXUsername(input.username)
  if (!isValidXUsername(username)) {
    return { ok: false, verified: false, error: 'Enter a valid X username to verify.' }
  }

  const body = { username, taskId: input.taskId }
  const result =
    (await verifyViaLocalApi(body)) ??
    (await verifyViaConfiguredUrl(body)) ??
    (await verifyViaSupabase(body))

  if (!result) {
    return {
      ok: false,
      verified: false,
      error: 'Verification service is unavailable. Try again in a moment.',
    }
  }
  return result
}

async function getTargets(url: string): Promise<XVerifyTarget | null> {
  try {
    const response = await fetch(url, { headers: { Accept: 'application/json' } })
    if (!response.ok) return null
    const payload = (await response.json()) as XVerifyTarget
    return payload?.handle ? payload : null
  } catch {
    return null
  }
}

export async function resolveXTargets(): Promise<XVerifyTarget | null> {
  const local = await getTargets('/api/x-targets')
  if (local) return local

  if (isSupabaseConfigured) {
    try {
      const { data, error } = await getSupabase().functions.invoke('verify-x-task', {
        body: { action: 'targets' },
      })
      const payload = data as XVerifyTarget | null
      if (!error && payload?.handle) return payload
    } catch {
      /* try configured URL next */
    }
  }

  const configured = import.meta.env.VITE_X_VERIFY_URL?.trim()
  return configured ? getTargets(new URL('?action=targets', configured).toString()) : null
}
