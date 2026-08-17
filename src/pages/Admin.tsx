import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import {
  adminListWaitlist,
  adminVerify,
  waitlistToCsv,
  type WaitlistEntry,
} from '../lib/waitlist'
import { isSupabaseConfigured } from '../lib/supabase'
import { shortenAddress } from '../lib/wallet'

const SESSION_KEY = 'strangers.admin'

type Session = {
  username: string
  password: string
}

function readSession(): Session | null {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as Session
    if (!parsed.username || !parsed.password) return null
    return parsed
  } catch {
    return null
  }
}

export function Admin() {
  const existing = useMemo(() => readSession(), [])
  const [session, setSession] = useState<Session | null>(existing)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [entries, setEntries] = useState<WaitlistEntry[]>([])

  const loadEntries = async (auth: Session) => {
    const result = await adminListWaitlist(auth.username, auth.password)
    if (!result.ok) {
      setSession(null)
      sessionStorage.removeItem(SESSION_KEY)
      setError(result.error)
      return
    }
    setEntries(result.entries)
  }

  useEffect(() => {
    if (!session) return
    void loadEntries(session)
  }, [session])

  const onLogin = async (event: FormEvent) => {
    event.preventDefault()
    setError('')
    setLoading(true)
    const ok = await adminVerify(username.trim(), password)
    setLoading(false)
    if (!ok) {
      setError('Invalid username or password.')
      return
    }
    const next = { username: username.trim(), password }
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(next))
    setSession(next)
  }

  const onLogout = () => {
    sessionStorage.removeItem(SESSION_KEY)
    setSession(null)
    setEntries([])
    setUsername('')
    setPassword('')
  }

  const onDownload = () => {
    const csv = waitlistToCsv(entries)
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    const stamp = new Date().toISOString().slice(0, 10)
    link.href = url
    link.download = `strangers-waitlist-${stamp}.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <main className="admin-shell">
      {!session ? (
        <section className="admin-card">
          <header className="mb-6">
            <p className="font-display text-4xl leading-none tracking-[0.14em] text-[#FC6224]">
              STRANGERS
            </p>
            <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#FC6224]/75">
              Admin
            </p>
          </header>
          <form className="flex flex-col gap-4" onSubmit={onLogin}>
            <Input
              label="USERNAME"
              name="admin-username"
              autoComplete="username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
            />
            <Input
              label="PASSWORD"
              name="admin-password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
            {error ? (
              <p role="alert" className="text-[11px] tracking-wide text-[#FC6224]">
                {error}
              </p>
            ) : null}
            <Button type="submit" variant="primary" className="w-full" disabled={loading}>
              {loading ? 'CHECKING' : 'LOG IN'}
            </Button>
          </form>
        </section>
      ) : (
        <section className="admin-card admin-wide">
          <header className="mb-6 flex items-end justify-between gap-4">
            <div>
              <p className="font-display text-4xl leading-none tracking-[0.14em] text-[#FC6224]">
                STRANGERS
              </p>
              <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#FC6224]/75">
                Waitlist results
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" onClick={() => void loadEntries(session)}>
                REFRESH
              </Button>
              <Button variant="ghost" onClick={onLogout}>
                LOG OUT
              </Button>
            </div>
          </header>

          <div className="mb-4 flex items-center justify-between gap-3">
            <p className="font-mono text-[12px] text-[#FC6224]">
              {entries.length} joined
              {!isSupabaseConfigured ? ' · local store' : ''}
            </p>
            <Button variant="primary" onClick={onDownload} disabled={entries.length === 0}>
              DOWNLOAD CSV
            </Button>
          </div>

          {entries.length === 0 ? (
            <p className="text-sm text-[#FC6224]/75">No waitlist entries yet.</p>
          ) : (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Wallet</th>
                    <th>Username X</th>
                    <th>Followed</th>
                    <th>Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {entries.map((entry) => (
                    <tr key={entry.id}>
                      <td>
                        <span className="font-mono">{shortenAddress(entry.wallet_address)}</span>
                        <span className="admin-full">{entry.wallet_address}</span>
                      </td>
                      <td>@{entry.x_username || '—'}</td>
                      <td>{entry.followed ? 'Yes' : 'No'}</td>
                      <td>{new Date(entry.created_at).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}
    </main>
  )
}
