export const COLORS = {
  PRIMARY: '#FC6224',
  BASE: '#1C1C1C',
} as const

export const PARALLAX = {
  ATMOSPHERE: 0.05,
  FAR: 0.1,
  MID: 0.3,
  CHARACTER: 1,
  FORE: 1.3,
} as const

export const SPRITE = {
  FRAME_COUNT: 8,
  SHEET_FRAMES: 8,
  FPS: 12,
  CYCLE_MS: 680,
} as const

export const MOVEMENT = {
  ENTER: -18,
  EXIT: 118,
  TRAVEL: 1.65,
} as const

export const DEPTH = {
  background: {
    scale: 0.16,
    speedScale: 0.72,
    ground: '20%',
    mobileGround: '22%',
    z: 20,
  },
  main: {
    scale: 0.22,
    speedScale: 1,
    ground: '9%',
    mobileGround: '17%',
    z: 30,
  },
  foreground: {
    scale: 0.3,
    speedScale: 1.15,
    ground: '4%',
    mobileGround: '15%',
    z: 40,
  },
} as const

export type DepthLevel = keyof typeof DEPTH
