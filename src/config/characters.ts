import { STRANGER_IMAGES } from '../assets/strangers'
import type { DepthLevel } from './constants'

export type CharacterConfig = {
  id: string
  src: string
  depth: DepthLevel
  speed: number
  direction: 1 | -1
  spawnDelay: number
  startX: number
  bounce: number
}

export const CHARACTERS: CharacterConfig[] = [
  {
    id: 'stranger-0014',
    src: STRANGER_IMAGES.character_0014,
    depth: 'main',
    speed: 118,
    direction: 1,
    spawnDelay: 0,
    startX: -18,
    bounce: 0,
  },
  {
    id: 'stranger-0018',
    src: STRANGER_IMAGES.character_0018,
    depth: 'main',
    speed: 138,
    direction: -1,
    spawnDelay: 1600,
    startX: 118,
    bounce: 0,
  },
  {
    id: 'stranger-0023',
    src: STRANGER_IMAGES.character_0023,
    depth: 'main',
    speed: 144,
    direction: -1,
    spawnDelay: 9800,
    startX: 116,
    bounce: 0,
  },
  {
    id: 'stranger-0016',
    src: STRANGER_IMAGES.character_0016,
    depth: 'background',
    speed: 96,
    direction: -1,
    spawnDelay: 7000,
    startX: 112,
    bounce: 0,
  },
  {
    id: 'stranger-0024',
    src: STRANGER_IMAGES.character_0024,
    depth: 'background',
    speed: 108,
    direction: 1,
    spawnDelay: 14000,
    startX: -18,
    bounce: 0,
  },
  {
    id: 'stranger-0022',
    src: STRANGER_IMAGES.character_0022,
    depth: 'foreground',
    speed: 124,
    direction: -1,
    spawnDelay: 3200,
    startX: 120,
    bounce: 0,
  },
  {
    id: 'stranger-0026',
    src: STRANGER_IMAGES.character_0026,
    depth: 'foreground',
    speed: 136,
    direction: 1,
    spawnDelay: 11000,
    startX: -20,
    bounce: 0,
  },
]
