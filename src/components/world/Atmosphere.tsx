import { useEffect, useRef } from 'react'
import { useReducedMotion } from '../../hooks/useReducedMotion'

export function Atmosphere() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let frame = 0
    let tile: HTMLCanvasElement | null = null

    const buildTile = () => {
      const size = 128
      const noise = document.createElement('canvas')
      noise.width = size
      noise.height = size
      const nctx = noise.getContext('2d')
      if (!nctx) return
      const image = nctx.createImageData(size, size)
      for (let i = 0; i < image.data.length; i += 4) {
        const on = Math.random() > 0.72
        image.data[i] = 252
        image.data[i + 1] = 98
        image.data[i + 2] = 36
        image.data[i + 3] = on ? 18 + Math.random() * 22 : 0
      }
      nctx.putImageData(image, 0, 0)
      tile = noise
    }

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    buildTile()
    resize()

    const start = performance.now()
    const draw = (now: number) => {
      if (!tile) return
      const t = (now - start) / 1000
      const shiftX = reduced ? 0 : t * 6
      const shiftY = reduced ? 0 : t * 3
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.globalAlpha = 0.22
      const pattern = ctx.createPattern(tile, 'repeat')
      if (pattern) {
        ctx.save()
        ctx.translate(shiftX % 128, shiftY % 128)
        ctx.fillStyle = pattern
        ctx.fillRect(-128, -128, canvas.width + 256, canvas.height + 256)
        ctx.restore()
      }
      frame = window.requestAnimationFrame(draw)
    }

    window.addEventListener('resize', resize)
    frame = window.requestAnimationFrame(draw)

    return () => {
      window.cancelAnimationFrame(frame)
      window.removeEventListener('resize', resize)
    }
  }, [reduced])

  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className={`haze-a ${reduced ? '' : 'is-alive'}`} />
      <div className={`haze-b ${reduced ? '' : 'is-alive'}`} />
      <div className="depth-fog" />
      <div className={`shadow-sweep ${reduced ? '' : 'is-alive'}`} />
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full opacity-80" />
    </div>
  )
}
