import { siteXVerifyConfig } from '../server/xVerifyConfig.ts'
import { resolveXTarget } from '../supabase/functions/_shared/xTaskVerifier.ts'

export const config = { maxDuration: 15 }

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Cache-Control': 'no-store',
}

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...cors, 'Content-Type': 'application/json; charset=utf-8' },
  })
}

export function OPTIONS(): Response {
  return new Response(null, { status: 204, headers: cors })
}

export async function GET(): Promise<Response> {
  try {
    return json(await resolveXTarget(siteXVerifyConfig()))
  } catch {
    return json({ error: 'Could not resolve X targets.' }, 500)
  }
}
