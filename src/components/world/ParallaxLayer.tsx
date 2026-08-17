import type { CSSProperties, ReactNode } from 'react'
import type { ParallaxOffset } from '../../hooks/useParallax'

type ParallaxLayerProps = {
  factor: number
  offset: ParallaxOffset
  children: ReactNode
  className?: string
  style?: CSSProperties
}

export function ParallaxLayer({
  factor,
  offset,
  children,
  className = '',
  style,
}: ParallaxLayerProps) {
  return (
    <div
      className={`pointer-events-none absolute inset-0 ${className}`}
      style={{
        transform: `translate3d(${offset.x * factor}px, ${offset.y * factor}px, 0)`,
        willChange: 'transform',
        ...style,
      }}
    >
      {children}
    </div>
  )
}
