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
  FPS: 8,
  CYCLE_MS: 1000,
} as const

export const MOVEMENT = {
  ENTER: -18,
  EXIT: 118,
} as const

export const DEPTH = {
  background: {
    scale: 0.36,
    speedScale: 0.42,
    ground: '36%',
    mobileGround: '56%',
    z: 20,
  },
  main: {
    scale: 0.56,
    speedScale: 1,
    ground: '25%',
    mobileGround: '48%',
    z: 30,
  },
  foreground: {
    scale: 0.74,
    speedScale: 1.45,
    ground: '15%',
    mobileGround: '40%',
    z: 40,
  },
} as const

export type DepthLevel = keyof typeof DEPTH
