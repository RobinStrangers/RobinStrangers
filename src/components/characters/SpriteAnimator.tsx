import { useEffect, useState } from 'react'
import { useFaceAnimation } from '../../hooks/useFaceAnimation'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { preloadCharacterRig, type CharacterRig } from '../../lib/createWalkFrames'

type SpriteAnimatorProps = {
  src: string
  playing: boolean
}

export function SpriteAnimator({ src, playing }: SpriteAnimatorProps) {
  const [rig, setRig] = useState<CharacterRig | null>(null)
  const reduced = useReducedMotion()
  const facePose = useFaceAnimation(Boolean(rig) && !reduced)

  useEffect(() => {
    let active = true
    void preloadCharacterRig(src).then((next) => {
      if (active) setRig(next)
    })
    return () => {
      active = false
    }
  }, [src])

  if (!rig) return null

  const duration = reduced ? rig.body.durationMs * 1.8 : rig.body.durationMs
  const face = reduced ? rig.face.frames.center : rig.face.frames[facePose]

  return (
    <div
      className="sprite-viewport"
      role="img"
      aria-label="Stranger walking"
      style={{
        width: rig.body.frameWidth,
        height: rig.body.frameHeight,
      }}
    >
      <img
        className={`sprite-strip ${playing ? 'is-playing' : 'is-paused'}`}
        src={rig.body.url}
        alt=""
        draggable={false}
        width={rig.body.frameWidth * rig.body.frameCount}
        height={rig.body.frameHeight}
        style={{
          animationDuration: `${duration}ms`,
        }}
      />
      <img
        className="face-layer"
        src={face}
        alt=""
        draggable={false}
        width={rig.face.width}
        height={rig.face.height}
        style={{
          left: rig.face.x,
          top: rig.face.y,
        }}
      />
    </div>
  )
}
