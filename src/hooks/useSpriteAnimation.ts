import { useEffect, useState } from 'react'
import { SPRITE } from '../config/constants'

const PING_PONG = [0, 1, 2, 3, 4, 3, 2, 1]

export function useSpriteAnimation(playing: boolean, reducedMotion: boolean) {
  const [frame, setFrame] = useState(0)

  useEffect(() => {
    if (!playing) {
      setFrame(0)
      return
    }

    const fps = reducedMotion ? 4 : SPRITE.FPS
    const interval = window.setInterval(() => {
      setFrame((current) => (current + 1) % PING_PONG.length)
    }, 1000 / fps)

    return () => window.clearInterval(interval)
  }, [playing, reducedMotion])

  return {
    frameIndex: PING_PONG[frame],
    sheetIndex: frame,
    sequence: PING_PONG,
  }
}
