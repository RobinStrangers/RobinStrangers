import { useEffect, useRef } from 'react'
import type { ParallaxOffset } from '../../hooks/useParallax'
import { useReducedMotion } from '../../hooks/useReducedMotion'

type Particle = {
  x: number
  y: number
  z: number
  s: number
  v: number
  drift: number
  size: number
  alpha: number
}

type ParticleLayerProps = {
  offset: ParallaxOffset
}

export function ParticleLayer({ offset }: ParticleLayerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const offsetRef = useRef(offset)
  const reduced = useReducedMotion()

  useEffect(() => {
    offsetRef.current = offset
  }, [offset])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let width = 0
    let height = 0
    let frame = 0
    let particles: Particle[] = []

    const count = () => {
      if (reduced) return 18
      return window.innerWidth < 768 ? 40 : 110
    }

    const spawn = (): Particle => ({
      x: Math.random() * width,
      y: Math.random() * height,
      z: 0.2 + Math.random() * 1.2,
      s: 6 + Math.random() * 18,
      v: 28 + Math.random() * 70,
      drift: -28 + Math.random() * 56,
      size: Math.random() > 0.62 ? 3 : Math.random() > 0.35 ? 2 : 1,
      alpha: 0.12 + Math.random() * 0.32,
    })

    const resize = () => {
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = width
      canvas.height = height
      particles = Array.from({ length: count() }, spawn)
    }

    resize()

    let last = performance.now()
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      const camera = offsetRef.current

      ctx.clearRect(0, 0, width, height)

      for (const particle of particles) {
        if (!reduced) {
          particle.y -= particle.v * dt * (0.35 + particle.z * 0.4)
          particle.x += particle.drift * dt * 0.25
        }

        if (particle.y < -8) {
          particle.y = height + 8
          particle.x = Math.random() * width
        }
        if (particle.x < -8) particle.x = width + 8
        if (particle.x > width + 8) particle.x = -8

        const px = particle.x + camera.x * particle.z * 0.55
        const py = particle.y + camera.y * particle.z * 0.55

        ctx.fillStyle = `rgba(252, 98, 36, ${particle.alpha})`
        ctx.fillRect(px, py, particle.size, particle.size)
      }

      frame = window.requestAnimationFrame(tick)
    }

    window.addEventListener('resize', resize)
    frame = window.requestAnimationFrame(tick)

    return () => {
      window.cancelAnimationFrame(frame)
      window.removeEventListener('resize', resize)
    }
  }, [reduced])

  return <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 z-[45] h-full w-full" />
}
