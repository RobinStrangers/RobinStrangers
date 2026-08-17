import { useReducedMotion } from '../../hooks/useReducedMotion'

export function ForegroundLayer() {
  const reduced = useReducedMotion()
  const live = reduced ? '' : 'is-alive'

  return (
    <div className="absolute inset-0">
      <div className={`fore-column left ${live}`} />
      <div className={`fore-column right ${live}`} />
      <div className={`fore-ledge ${live}`} />
      <div className={`fore-shard a ${live}`} />
      <div className={`fore-shard b ${live}`} />
      <div className="fore-vignette" />
    </div>
  )
}
