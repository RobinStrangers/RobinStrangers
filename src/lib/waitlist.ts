import { getSupabase, isSupabaseConfigured } from './supabase'

export type WaitlistEntry = {
  id: string
  wallet_address: string
  x_username: string
  followed: boolean
  created_at: string
}

const LOCAL_KEY = 'strangers.waitlist'

function readLocal(): WaitlistEntry[] {
  try {
    const raw = localStorage.getItem(LOCAL_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as WaitlistEntry[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function writeLocal(entries: WaitlistEntry[]) {
  localStorage.setItem(LOCAL_KEY, JSON.stringify(entries))
}

export async function saveWaitlistEntry(input: {
  walletAddress: string
  xUsername: string
  followed: boolean
}): Promise<{ ok: true } | { ok: false; error: string }> {
  const wallet = input.walletAddress.trim().toLowerCase()
  const xUsername = input.xUsername.trim().replace(/^@+/, '')

  if (isSupabaseConfigured) {
    const { error } = await getSupabase().from('waitlist_entries').insert({
      wallet_address: wallet,
      x_username: xUsername,
      followed: input.followed,
    })

    if (error) {
      if (error.code === '23505') {
        return { ok: false, error: 'This wallet is already on the waitlist.' }
      }
      return { ok: false, error: error.message || 'Could not save waitlist entry.' }
    }
    return { ok: true }
  }

  const current = readLocal()
  if (current.some((entry) => entry.wallet_address.toLowerCase() === wallet.toLowerCase())) {
    return { ok: false, error: 'This wallet is already on the waitlist.' }
  }

  writeLocal([
    {
      id: crypto.randomUUID(),
      wallet_address: wallet,
      x_username: xUsername,
      followed: input.followed,
      created_at: new Date().toISOString(),
    },
    ...current,
  ])
  return { ok: true }
}

export async function adminVerify(username: string, password: string): Promise<boolean> {
  if (isSupabaseConfigured) {
    const { data, error } = await getSupabase().rpc('admin_verify', {
      p_username: username,
      p_password: password,
    })
    if (error) return false
    return Boolean(data)
  }
  return username === 'Serlay' && password === 'Ser2026'
}

export async function adminListWaitlist(
  username: string,
  password: string,
): Promise<{ ok: true; entries: WaitlistEntry[] } | { ok: false; error: string }> {
  if (isSupabaseConfigured) {
    const { data, error } = await getSupabase().rpc('admin_list_waitlist', {
      p_username: username,
      p_password: password,
    })
    if (error) return { ok: false, error: error.message || 'Unauthorized.' }
    return {
      ok: true,
      entries: ((data ?? []) as WaitlistEntry[]).map((entry) => ({
        ...entry,
        x_username: entry.x_username ?? '',
      })),
    }
  }

  const allowed = await adminVerify(username, password)
  if (!allowed) return { ok: false, error: 'Unauthorized.' }
  return { ok: true, entries: readLocal() }
}

export function waitlistToCsv(entries: WaitlistEntry[]): string {
  const header = 'wallet_address,x_username,followed,created_at'
  const rows = entries.map((entry) =>
    [
      entry.wallet_address,
      entry.x_username || '',
      entry.followed ? 'yes' : 'no',
      entry.created_at,
    ].join(','),
  )
  return [header, ...rows].join('\n')
}
