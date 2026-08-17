import { forwardRef, type CSSProperties, type ReactNode } from 'react'
import { DEPTH, walkTransform, type DepthLevel } from '../../config/constants'

type CharacterMovementProps = {
  depth: DepthLevel
  children: ReactNode
}

export const CharacterMovement = forwardRef<HTMLDivElement, CharacterMovementProps>(
  function CharacterMovement({ depth, children }, ref) {
    const profile = DEPTH[depth]

    const style: CSSProperties = {
      position: 'absolute',
      left: 0,
      bottom: `var(--ground-${depth}, ${profile.ground})`,
      zIndex: profile.z,
      transform: walkTransform(-20, profile.scale, profile.scale),
      transformOrigin: '50% 100%',
      opacity: 0,
      willChange: 'transform, opacity',
      pointerEvents: 'none',
    }

    return (
      <div ref={ref} className="character-movement" style={style}>
        {children}
      </div>
    )
  },
)
