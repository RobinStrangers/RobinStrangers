import { useEffect } from 'react'
import { useParallax } from '../../hooks/useParallax'
import { preloadStrangerAssets } from '../../lib/preloadImages'
import { Environment } from './Environment'

export function LivingWorld() {
  const offset = useParallax()

  useEffect(() => {
    void preloadStrangerAssets()
  }, [])

  return (
    <div className="living-world" aria-hidden="true">
      <Environment offset={offset} />
    </div>
  )
}
