import type { IncomingMessage, ServerResponse } from 'node:http'
import {
  defaultXVerifyConfig,
  resolveXTarget,
  verifyXRequest,
  type VerifyTaskId,
  type XVerifyConfig,
} from '../supabase/functions/_shared/xTaskVerifier.ts'

const RATE_MS = 2500
const lastCall = new Map<string, number>()

function clientKey(req: IncomingMessage, username: string, taskId: string): string {
  const forwarded = req.headers['x-forwarded-for']
  const ip = typeof forwarded === 'string' ? forwarded.split(',')[0]?.trim() : req.socket.remoteAddress
  return `${ip ?? 'local'}:${username.toLowerCase()}:${taskId}`
}

function send(res: ServerResponse, status: number, body: unknown): void {
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  res.setHeader('Cache-Control', 'no-store')
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  res.end(JSON.stringify(body))
}

function readBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = []
    req.on('data', (chunk) => {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk))
      if (chunks.reduce((sum, item) => sum + item.length, 0) > 16_384) {
        reject(new Error('Request too large'))
      }
    })
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')))
    req.on('error', reject)
  })
}

function isTaskId(value: unknown): value is VerifyTaskId {
  return value === 'follow' || value === 'like' || value === 'retweet' || value === 'all'
}

export function createXVerifyConfig(overrides: Partial<XVerifyConfig> = {}): XVerifyConfig {
  return { ...defaultXVerifyConfig(), ...overrides }
}

export async function handleXVerifyRequest(
  req: IncomingMessage,
  res: ServerResponse,
  config: XVerifyConfig,
): Promise<boolean> {
  const url = req.url ?? ''
  const path = url.split('?')[0] ?? ''
  if (path !== '/api/verify-x' && path !== '/api/x-targets') return false

  if (req.method === 'OPTIONS') {
    send(res, 204, {})
    return true
  }

  try {
    if (path === '/api/x-targets' && req.method === 'GET') {
      const target = await resolveXTarget(config)
      send(res, 200, target)
      return true
    }

    if (path !== '/api/verify-x' || req.method !== 'POST') {
      send(res, 405, { ok: false, verified: false, error: 'Method not allowed.' })
      return true
    }

    const raw = await readBody(req)
    const parsed = raw ? (JSON.parse(raw) as { username?: unknown; taskId?: unknown }) : {}
    const username = typeof parsed.username === 'string' ? parsed.username : ''
    const taskId = parsed.taskId
    if (!isTaskId(taskId)) {
      send(res, 400, { ok: false, verified: false, error: 'Unknown task.' })
      return true
    }

    const key = clientKey(req, username, taskId)
    const previous = lastCall.get(key) ?? 0
    if (Date.now() - previous < RATE_MS) {
      send(res, 429, {
        ok: false,
        verified: false,
        error: 'Wait a moment, then verify again.',
      })
      return true
    }
    lastCall.set(key, Date.now())

    const result = await verifyXRequest({ username, taskId }, config)
    send(res, result.verified ? 200 : 409, result)
    return true
  } catch {
    send(res, 500, {
      ok: false,
      verified: false,
      error: 'Verification failed. Try again in a moment.',
    })
    return true
  }
}
