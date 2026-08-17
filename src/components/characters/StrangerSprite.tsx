import { SpriteAnimator } from './SpriteAnimator'

type StrangerSpriteProps = {
  src: string
  walking: boolean
}

export function StrangerSprite({ src, walking }: StrangerSpriteProps) {
  return (
    <div className="stranger-sprite">
      <SpriteAnimator src={src} playing={walking} />
    </div>
  )
}
