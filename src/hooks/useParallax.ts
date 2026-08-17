import { useEffect, useState } from 'react'
import { useReducedMotion } from './useReducedMotion'

export type ParallaxOffset = {
  x: number
  y: number
}

const EMPTY: ParallaxOffset = { x: 0, y: 0 }

function hasFinePointer() {
  return window.matchMedia('(pointer: fine)').matches && window.innerWidth >= 768
}

export function useParallax(): ParallaxOffset {
  const reduced = useReducedMotion()
  const [offset, setOffset] = useState<ParallaxOffset>(EMPTY)

  useEffect(() => {
    if (reduced) {
      setOffset(EMPTY)
      return
    }

    let frame = 0
    let pointerX = 0
    let pointerY = 0
    let usePointer = hasFinePointer()
    const start = performance.now()

    const onPointer = (event: PointerEvent) => {
      if (!usePointer) return
      const cx = window.innerWidth / 2
      const cy = window.innerHeight / 2
      pointerX = (event.clientX - cx) / cx
      pointerY = (event.clientY - cy) / cy
    }

    const onResize = () => {
      usePointer = hasFinePointer()
    }

    const tick = (now: number) => {
      const t = (now - start) / 1000
      const autoX = Math.sin(t * 0.7) * 18 + Math.sin(t * 0.31) * 8
      const autoY = Math.cos(t * 0.52) * 12 + Math.sin(t * 0.24) * 6

      if (usePointer) {
        setOffset({
          x: pointerX * 26 + autoX * 0.45,
          y: pointerY * 16 + autoY * 0.45,
        })
      } else {
        setOffset({
          x: autoX,
          y: autoY,
        })
      }

      frame = window.requestAnimationFrame(tick)
    }

    window.addEventListener('pointermove', onPointer, { passive: true })
    window.addEventListener('resize', onResize)
    frame = window.requestAnimationFrame(tick)

    return () => {
      window.cancelAnimationFrame(frame)
      window.removeEventListener('pointermove', onPointer)
      window.removeEventListener('resize', onResize)
    }
  }, [reduced])

  return offset
}
