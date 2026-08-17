import { useRef } from 'react'
import type { CharacterConfig } from '../../config/characters'
import { useCharacterMovement } from '../../hooks/useCharacterMovement'
import { CharacterMovement } from './CharacterMovement'
import { StrangerSprite } from './StrangerSprite'

type StrangerProps = {
  config: CharacterConfig
}

export function Stranger({ config }: StrangerProps) {
  const nodeRef = useRef<HTMLDivElement>(null)
  const pose = useCharacterMovement({
    speed: config.speed,
    direction: config.direction,
    spawnDelay: config.spawnDelay,
    startX: config.startX,
    depth: config.depth,
    nodeRef,
  })

  return (
    <CharacterMovement ref={nodeRef} depth={config.depth}>
      <StrangerSprite src={config.src} walking={pose.walking && pose.visible} />
    </CharacterMovement>
  )
}
