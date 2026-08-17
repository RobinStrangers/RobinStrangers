import { useCallback, useEffect, useState } from 'react'
import { SiteLoader } from './components/intro/SiteLoader'
import { Admin } from './pages/Admin'
import { Home } from './pages/Home'
import { FlowProvider } from './state/FlowContext'

function useHash() {
  const [hash, setHash] = useState(() => window.location.hash)

  useEffect(() => {
    const onChange = () => setHash(window.location.hash)
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])

  return hash
}

export default function App() {
  const hash = useHash()
  const isAdmin = hash.startsWith('#/admin')
  const [booting, setBooting] = useState(!isAdmin)
  const finishBoot = useCallback(() => setBooting(false), [])

  if (isAdmin) return <Admin />

  return (
    <FlowProvider>
      {booting ? <SiteLoader onFinished={finishBoot} /> : null}
      <Home />
    </FlowProvider>
  )
}
