import { SPRITE } from '../config/constants'

export type WalkSheet = {
  url: string
  frameWidth: number
  frameHeight: number
  frameCount: number
  durationMs: number
}

export type FacePose = 'center' | 'blink' | 'left' | 'right' | 'leftBlink' | 'rightBlink'

export type FaceRig = {
  frames: Record<FacePose, string>
  width: number
  height: number
  x: number
  y: number
}

export type CharacterRig = {
  full: WalkSheet
  body: WalkSheet
  face: FaceRig
}

const sheetCache = new Map<string, Promise<WalkSheet>>()
const rigCache = new Map<string, Promise<CharacterRig>>()
const imageCache = new Map<string, Promise<HTMLImageElement>>()

export function preloadImage(src: string): Promise<HTMLImageElement> {
  const cached = imageCache.get(src)
  if (cached) return cached

  const promise = new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image()
    image.decoding = 'async'
    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error(`Failed to load ${src}`))
    image.src = src
  })

  imageCache.set(src, promise)
  return promise
}

export function preloadWalkSheet(src: string): Promise<WalkSheet> {
  const cached = sheetCache.get(src)
  if (cached) return cached

  const promise = preloadCharacterRig(src).then((rig) => rig.full)
  sheetCache.set(src, promise)
  return promise
}

export function preloadCharacterRig(src: string): Promise<CharacterRig> {
  const cached = rigCache.get(src)
  if (cached) return cached

  const promise = buildCharacterRig(src)
  rigCache.set(src, promise)
  return promise
}

function sheetFromFrames(frames: HTMLCanvasElement[]): WalkSheet {
  const frameWidth = frames[0].width
  const frameHeight = frames[0].height
  const sheet = document.createElement('canvas')
  sheet.width = frameWidth * frames.length
  sheet.height = frameHeight
  const ctx = sheet.getContext('2d')
  if (!ctx) throw new Error('Canvas unavailable')
  ctx.imageSmoothingEnabled = false

  frames.forEach((frame, index) => {
    ctx.drawImage(frame, index * frameWidth, 0)
  })

  return {
    url: sheet.toDataURL('image/png'),
    frameWidth,
    frameHeight,
    frameCount: frames.length,
    durationMs: SPRITE.CYCLE_MS,
  }
}

async function buildCharacterRig(src: string): Promise<CharacterRig> {
  const image = await preloadImage(src)
  const isolated = isolateCharacter(image)
  attachNeck(isolated)
  const fullFrames = makeWalkFrames(isolated)
  const bounds = contentBounds(isolated)
  const neckY = findNeckSplit(isolated, bounds)
  const bodyFrames = fullFrames.map((frame) => eraseHead(frame, neckY))
  const face = makeFaceRig(isolated, bounds, neckY, fullFrames[0].width, 10, src)

  return {
    full: sheetFromFrames(fullFrames),
    body: sheetFromFrames(bodyFrames),
    face,
  }
}

function quantize(r: number, g: number, b: number) {
  return `${r >> 4},${g >> 4},${b >> 4}`
}

function isDarkOutline(r: number, g: number, b: number) {
  return r + g + b < 72
}

function isolateCharacter(image: HTMLImageElement): HTMLCanvasElement {
  const canvas = document.createElement('canvas')
  canvas.width = image.naturalWidth
  canvas.height = image.naturalHeight
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  if (!ctx) return canvas

  ctx.imageSmoothingEnabled = false
  ctx.drawImage(image, 0, 0)

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
  const original = new Uint8ClampedArray(imageData.data)
  const { data, width, height } = imageData
  const bgKeys = new Set<string>()
  const border = 5

  const sample = (x: number, y: number) => {
    const p = (y * width + x) * 4
    const r = data[p]
    const g = data[p + 1]
    const b = data[p + 2]
    if (!isDarkOutline(r, g, b)) bgKeys.add(quantize(r, g, b))
  }

  for (let x = 0; x < width; x += 1) {
    for (let y = 0; y < border; y += 1) sample(x, y)
    for (let y = height - border; y < height; y += 1) sample(x, y)
  }
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < border; x += 1) sample(x, y)
    for (let x = width - border; x < width; x += 1) sample(x, y)
  }

  const isBackground = (r: number, g: number, b: number) => {
    if (isDarkOutline(r, g, b)) return false
    return bgKeys.has(quantize(r, g, b))
  }

  const seen = new Uint8Array(width * height)
  const stack: number[] = []
  const push = (x: number, y: number) => {
    if (x < 0 || y < 0 || x >= width || y >= height) return
    const i = y * width + x
    if (seen[i]) return
    const p = i * 4
    if (!isBackground(data[p], data[p + 1], data[p + 2])) return
    seen[i] = 1
    stack.push(i)
  }

  for (let x = 0; x < width; x += 1) {
    push(x, 0)
    push(x, height - 1)
  }
  for (let y = 0; y < height; y += 1) {
    push(0, y)
    push(width - 1, y)
  }

  while (stack.length > 0) {
    const i = stack.pop()
    if (i === undefined) break
    data[i * 4 + 3] = 0
    const x = i % width
    const y = (i / width) | 0
    push(x - 1, y)
    push(x + 1, y)
    push(x, y - 1)
    push(x, y + 1)
  }

  const edgeTransparent = new Uint8Array(width * height)
  const holeStack: number[] = []
  const pushHole = (x: number, y: number) => {
    if (x < 0 || y < 0 || x >= width || y >= height) return
    const i = y * width + x
    if (edgeTransparent[i]) return
    if (data[i * 4 + 3] > 18) return
    edgeTransparent[i] = 1
    holeStack.push(i)
  }

  for (let x = 0; x < width; x += 1) {
    pushHole(x, 0)
    pushHole(x, height - 1)
  }
  for (let y = 0; y < height; y += 1) {
    pushHole(0, y)
    pushHole(width - 1, y)
  }

  while (holeStack.length > 0) {
    const i = holeStack.pop()
    if (i === undefined) break
    const x = i % width
    const y = (i / width) | 0
    pushHole(x - 1, y)
    pushHole(x + 1, y)
    pushHole(x, y - 1)
    pushHole(x, y + 1)
  }

  for (let i = 0; i < width * height; i += 1) {
    if (data[i * 4 + 3] > 18) continue
    if (edgeTransparent[i]) continue
    const p = i * 4
    data[p] = original[p]
    data[p + 1] = original[p + 1]
    data[p + 2] = original[p + 2]
    data[p + 3] = original[p + 3]
  }

  ctx.putImageData(imageData, 0, 0)
  return canvas
}

function contentBounds(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  if (!ctx) {
    return { minX: 0, minY: 0, maxX: canvas.width - 1, maxY: canvas.height - 1 }
  }

  const { data, width, height } = ctx.getImageData(0, 0, canvas.width, canvas.height)
  let minX = width
  let minY = height
  let maxX = 0
  let maxY = 0

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      if (data[(y * width + x) * 4 + 3] > 18) {
        if (x < minX) minX = x
        if (y < minY) minY = y
        if (x > maxX) maxX = x
        if (y > maxY) maxY = y
      }
    }
  }

  if (maxX < minX) {
    return { minX: 0, minY: 0, maxX: width - 1, maxY: height - 1 }
  }

  return { minX, minY, maxX, maxY }
}

type FootPose = {
  lX: number
  lY: number
  rX: number
  rY: number
}

const WALK_POSES: FootPose[] = [
  { lX: -3, lY: 1, rX: 3, rY: -5 },
  { lX: -2, lY: 2, rX: 2, rY: -7 },
  { lX: 0, lY: 0, rX: 0, rY: -4 },
  { lX: 2, lY: -4, rX: -2, rY: 0 },
  { lX: 3, lY: -5, rX: -3, rY: 1 },
  { lX: 2, lY: -7, rX: -2, rY: 2 },
  { lX: 0, lY: -4, rX: 0, rY: 0 },
  { lX: -2, lY: 0, rX: 2, rY: -4 },
]

function makeWalkFrames(source: HTMLCanvasElement): HTMLCanvasElement[] {
  const bounds = contentBounds(source)
  const width = source.width
  const height = source.height
  const charW = bounds.maxX - bounds.minX
  const charH = bounds.maxY - bounds.minY
  const shoeTop = Math.round(bounds.maxY - charH * 0.11)
  const shoeLeft = Math.round(bounds.minX + charW * 0.2)
  const shoeRight = Math.round(bounds.maxX - charW * 0.2)
  const shoeMid = Math.round((shoeLeft + shoeRight) / 2)
  const shoeH = Math.max(8, height - shoeTop)
  const padX = 12
  const padTop = 10
  const padBottom = 12
  const frameW = width + padX * 2
  const frameH = height + padTop + padBottom

  return WALK_POSES.map((pose) => {
    const frame = document.createElement('canvas')
    frame.width = frameW
    frame.height = frameH
    const ctx = frame.getContext('2d')
    if (!ctx) return frame
    ctx.imageSmoothingEnabled = false

    const groundY = padTop + bounds.maxY + 8
    const centerX = padX + (bounds.minX + bounds.maxX) / 2
    ctx.fillStyle = 'rgba(252, 98, 36, 0.16)'
    ctx.beginPath()
    ctx.ellipse(centerX, groundY, charW * 0.2, 4, 0, 0, Math.PI * 2)
    ctx.fill()

    ctx.drawImage(source, padX, padTop)

    const leftW = shoeMid - shoeLeft
    const rightW = shoeRight - shoeMid

    ctx.drawImage(
      source,
      shoeLeft,
      shoeTop,
      leftW,
      shoeH,
      padX + shoeLeft + pose.lX,
      padTop + shoeTop + pose.lY,
      leftW,
      shoeH,
    )
    ctx.drawImage(
      source,
      shoeMid,
      shoeTop,
      rightW,
      shoeH,
      padX + shoeMid + pose.rX,
      padTop + shoeTop + pose.rY,
      rightW,
      shoeH,
    )

    return frame
  })
}

function rowSpans(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  const width = canvas.width
  const height = canvas.height
  const minX = new Array<number>(height).fill(width)
  const maxX = new Array<number>(height).fill(-1)
  if (!ctx) return { minX, maxX }

  const { data } = ctx.getImageData(0, 0, width, height)
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      if (data[(y * width + x) * 4 + 3] <= 18) continue
      if (x < minX[y]) minX[y] = x
      if (x > maxX[y]) maxX[y] = x
    }
  }
  return { minX, maxX }
}

function findNeckGap(canvas: HTMLCanvasElement) {
  const bounds = contentBounds(canvas)
  const { minX, maxX } = rowSpans(canvas)
  const charH = bounds.maxY - bounds.minY
  const y0 = Math.round(bounds.minY + charH * 0.35)
  const y1 = Math.round(bounds.minY + charH * 0.65)

  let bestTop = -1
  let bestBot = -1
  let runStart = -1
  for (let y = y0; y <= y1 + 1; y += 1) {
    const empty = y > y1 || maxX[y] < 0
    if (empty) {
      if (runStart < 0) runStart = y
      continue
    }
    if (runStart >= 0 && y - runStart > bestBot - bestTop) {
      bestTop = runStart
      bestBot = y - 1
    }
    runStart = -1
  }

  if (bestTop <= 0 || bestBot >= canvas.height - 1) return null
  if (maxX[bestTop - 1] < 0 || maxX[bestBot + 1] < 0) return null

  const scale = bestBot - bestTop + 1
  if (scale < 4) return null

  return {
    gapTop: bestTop,
    gapBot: bestBot,
    scale,
    chinMinX: minX[bestTop - 1],
    chinMaxX: maxX[bestTop - 1],
  }
}

function parseRgb(color: string): [number, number, number] {
  const match = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/)
  if (!match) return [224, 186, 148]
  return [Number(match[1]), Number(match[2]), Number(match[3])]
}

function attachNeck(canvas: HTMLCanvasElement) {
  const gap = findNeckGap(canvas)
  if (!gap) return

  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const bounds = contentBounds(canvas)
  const [sr, sg, sb] = parseRgb(sampleSkin(canvas, { ...bounds, maxY: gap.gapTop }))
  const scale = gap.scale
  const neckW = scale * 8
  const center = Math.round((gap.chinMinX + gap.chinMaxX + 1) / 2)
  const neckLeft = Math.floor((center - neckW / 2) / scale) * scale
  const neckRight = neckLeft + neckW - 1
  const y0 = gap.gapTop
  const y1 = gap.gapBot + scale
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
  const { data, width } = imageData

  for (let y = y0; y <= y1; y += 1) {
    for (let x = neckLeft; x <= neckRight; x += 1) {
      const p = (y * width + x) * 4
      const outline = x < neckLeft + scale || x > neckRight - scale
      data[p] = outline ? 18 : sr
      data[p + 1] = outline ? 16 : sg
      data[p + 2] = outline ? 20 : sb
      data[p + 3] = 255
    }
  }

  ctx.putImageData(imageData, 0, 0)
}

function findNeckSplit(canvas: HTMLCanvasElement, bounds: Bounds) {
  const fallback = Math.round(bounds.minY + (bounds.maxY - bounds.minY) * 0.5)
  const { minX, maxX } = rowSpans(canvas)
  const charH = bounds.maxY - bounds.minY
  const y0 = Math.round(bounds.minY + charH * 0.38)
  const y1 = Math.round(bounds.minY + charH * 0.62)
  if (y1 <= y0) return fallback

  let minW = Infinity
  let minY = y0
  const widths = new Array<number>(y1 - y0 + 1)
  for (let y = y0; y <= y1; y += 1) {
    const width = maxX[y] < 0 ? 0 : maxX[y] - minX[y] + 1
    widths[y - y0] = width
    if (width > 0 && width < minW) {
      minW = width
      minY = y
    }
  }

  if (!Number.isFinite(minW)) return fallback

  const thresh = minW + Math.max(8, Math.round(minW * 0.25))
  let top = minY
  while (top > y0 && widths[top - y0 - 1] > 0 && widths[top - y0 - 1] <= thresh) {
    top -= 1
  }
  return top
}

function eraseHead(source: HTMLCanvasElement, neckY: number) {
  const frame = document.createElement('canvas')
  frame.width = source.width
  frame.height = source.height
  const ctx = frame.getContext('2d')
  if (!ctx) return source
  ctx.imageSmoothingEnabled = false
  ctx.drawImage(source, 0, 0)
  ctx.clearRect(0, 0, frame.width, 10 + neckY)
  return frame
}

type Bounds = ReturnType<typeof contentBounds>

type EyeBox = { minX: number; minY: number; maxX: number; maxY: number }

const CHARACTER_EYES: Record<string, { left: EyeBox; right: EyeBox }> = {
  character_0014: {
    left: { minX: 120, minY: 140, maxX: 139, maxY: 160 },
    right: { minX: 170, minY: 150, maxX: 199, maxY: 159 },
  },
  character_0016: {
    left: { minX: 110, minY: 130, maxX: 153, maxY: 158 },
    right: { minX: 167, minY: 130, maxX: 219, maxY: 158 },
  },
  character_0018: {
    left: { minX: 120, minY: 140, maxX: 149, maxY: 156 },
    right: { minX: 170, minY: 140, maxX: 199, maxY: 156 },
  },
  character_0022: {
    left: { minX: 100, minY: 140, maxX: 139, maxY: 164 },
    right: { minX: 165, minY: 140, maxX: 199, maxY: 164 },
  },
  character_0023: {
    left: { minX: 120, minY: 140, maxX: 139, maxY: 160 },
    right: { minX: 170, minY: 150, maxX: 199, maxY: 159 },
  },
  character_0024: {
    left: { minX: 110, minY: 140, maxX: 139, maxY: 158 },
    right: { minX: 170, minY: 140, maxX: 199, maxY: 158 },
  },
  character_0026: {
    left: { minX: 120, minY: 140, maxX: 139, maxY: 160 },
    right: { minX: 170, minY: 150, maxX: 199, maxY: 159 },
  },
}

function characterKey(src: string) {
  const match = src.match(/character_\d+/)
  return match ? match[0] : ''
}

function isSkinTone(r: number, g: number, b: number) {
  return r > 168 && g > 128 && b > 82 && r >= g - 8 && g >= b - 24 && r - g < 85 && r - b < 115
}

function isEyeLike(r: number, g: number, b: number) {
  if (isSkinTone(r, g, b)) return false
  const sum = r + g + b
  const sat = Math.max(r, g, b) - Math.min(r, g, b)
  if (sum < 120) return true
  if (r > 215 && g > 215 && b > 215) return true
  if (r > 170 && g > 150 && b < 130 && r + g > 340) return true
  if (sat > 55) return true
  return false
}

function sampleSkin(source: HTMLCanvasElement, bounds: Bounds): string {
  const ctx = source.getContext('2d', { willReadFrequently: true })
  if (!ctx) return 'rgb(224, 186, 148)'
  const { data, width } = ctx.getImageData(0, 0, source.width, source.height)
  const y0 = Math.round(bounds.minY + (bounds.maxY - bounds.minY) * 0.28)
  const y1 = Math.round(bounds.minY + (bounds.maxY - bounds.minY) * 0.5)
  const x0 = Math.round(bounds.minX + (bounds.maxX - bounds.minX) * 0.28)
  const x1 = Math.round(bounds.maxX - (bounds.maxX - bounds.minX) * 0.28)
  let r = 0
  let g = 0
  let b = 0
  let count = 0
  for (let y = y0; y <= y1; y += 1) {
    for (let x = x0; x <= x1; x += 1) {
      const p = (y * width + x) * 4
      if (data[p + 3] < 40) continue
      const pr = data[p]
      const pg = data[p + 1]
      const pb = data[p + 2]
      if (!isSkinTone(pr, pg, pb)) continue
      r += pr
      g += pg
      b += pb
      count += 1
    }
  }
  if (!count) return 'rgb(224, 186, 148)'
  return `rgb(${Math.round(r / count)}, ${Math.round(g / count)}, ${Math.round(b / count)})`
}

function boxFromPixels(pixels: Array<{ x: number; y: number }>, fallback: EyeBox): EyeBox {
  if (!pixels.length) return fallback
  let minX = pixels[0].x
  let minY = pixels[0].y
  let maxX = pixels[0].x
  let maxY = pixels[0].y
  for (const pixel of pixels) {
    if (pixel.x < minX) minX = pixel.x
    if (pixel.y < minY) minY = pixel.y
    if (pixel.x > maxX) maxX = pixel.x
    if (pixel.y > maxY) maxY = pixel.y
  }
  return { minX, minY, maxX, maxY }
}

function findEyes(source: HTMLCanvasElement, bounds: Bounds): EyeBox[] {
  const ctx = source.getContext('2d', { willReadFrequently: true })
  if (!ctx) return []
  const { data, width } = ctx.getImageData(0, 0, source.width, source.height)
  const headH = Math.max(1, bounds.maxY - bounds.minY)
  const headW = Math.max(1, bounds.maxX - bounds.minX)
  const y0 = Math.round(bounds.minY + headH * 0.36)
  const y1 = Math.round(bounds.minY + headH * 0.62)
  const x0 = Math.round(bounds.minX + headW * 0.14)
  const x1 = Math.round(bounds.maxX - headW * 0.14)
  const midX = Math.round((bounds.minX + bounds.maxX) / 2)

  let eyeRow = Math.round((y0 + y1) / 2)
  let bestCount = 0
  for (let y = y0; y <= y1; y += 1) {
    let count = 0
    for (let x = x0; x <= x1; x += 1) {
      const p = (y * width + x) * 4
      if (data[p + 3] < 40) continue
      if (isEyeLike(data[p], data[p + 1], data[p + 2])) count += 1
    }
    if (count > bestCount) {
      bestCount = count
      eyeRow = y
    }
  }

  const band = Math.max(8, Math.round(headH * 0.08))
  const bandTop = Math.max(y0, eyeRow - band)
  const bandBot = Math.min(y1, eyeRow + band)
  const inset = Math.round(headW * 0.06)
  const leftPixels: Array<{ x: number; y: number }> = []
  const rightPixels: Array<{ x: number; y: number }> = []

  for (let y = bandTop; y <= bandBot; y += 1) {
    for (let x = x0 + inset; x <= x1 - inset; x += 1) {
      const p = (y * width + x) * 4
      if (data[p + 3] < 40) continue
      if (!isEyeLike(data[p], data[p + 1], data[p + 2])) continue
      if (x < midX - 2) leftPixels.push({ x, y })
      else if (x > midX + 2) rightPixels.push({ x, y })
    }
  }

  const eyeH = Math.max(8, Math.round(headH * 0.08))
  const leftFallback: EyeBox = {
    minX: midX - Math.round(headW * 0.28),
    maxX: midX - Math.round(headW * 0.1),
    minY: eyeRow - Math.round(eyeH / 2),
    maxY: eyeRow + Math.round(eyeH / 2),
  }
  const rightFallback: EyeBox = {
    minX: midX + Math.round(headW * 0.1),
    maxX: midX + Math.round(headW * 0.28),
    minY: eyeRow - Math.round(eyeH / 2),
    maxY: eyeRow + Math.round(eyeH / 2),
  }

  const left = boxFromPixels(leftPixels, leftFallback)
  const right = boxFromPixels(rightPixels, rightFallback)
  if (left.maxX - left.minX < 4) Object.assign(left, leftFallback)
  if (right.maxX - right.minX < 4) Object.assign(right, rightFallback)
  if (left.maxY - left.minY < 3) {
    left.minY = eyeRow - 4
    left.maxY = eyeRow + 4
  }
  if (right.maxY - right.minY < 3) {
    right.minY = eyeRow - 4
    right.maxY = eyeRow + 4
  }

  return [left, right]
}

function applyBlink(ctx: CanvasRenderingContext2D, eyes: EyeBox[], skin: string) {
  for (const eye of eyes) {
    const w = Math.max(6, eye.maxX - eye.minX + 1)
    const h = Math.max(6, eye.maxY - eye.minY + 1)
    const y = eye.minY
    ctx.fillStyle = skin
    ctx.fillRect(eye.minX, y, w, h)
    ctx.fillStyle = '#141414'
    ctx.fillRect(eye.minX, y + Math.round(h / 2) - 2, w, 4)
  }
}

function makeFaceRig(
  source: HTMLCanvasElement,
  bounds: Bounds,
  neckY: number,
  frameW: number,
  padTop: number,
  src: string,
): FaceRig {
  const padX = 12
  const height = padTop + neckY + 6
  const skin = sampleSkin(source, { ...bounds, maxY: neckY })
  const mapped = CHARACTER_EYES[characterKey(src)]
  const eyes = mapped
    ? [mapped.left, mapped.right]
    : findEyes(source, { ...bounds, maxY: neckY })

  const drawFace = (lookX: number, blink: boolean) => {
    const canvas = document.createElement('canvas')
    canvas.width = frameW
    canvas.height = height
    const ctx = canvas.getContext('2d')
    if (!ctx) return canvas.toDataURL('image/png')
    ctx.imageSmoothingEnabled = false
    ctx.drawImage(
      source,
      0,
      0,
      source.width,
      neckY + 6,
      padX + lookX,
      padTop,
      source.width,
      neckY + 6,
    )
    if (blink) {
      ctx.save()
      ctx.translate(padX + lookX, padTop)
      applyBlink(ctx, eyes, skin)
      ctx.restore()
    }
    return canvas.toDataURL('image/png')
  }

  return {
    frames: {
      center: drawFace(0, false),
      blink: drawFace(0, true),
      left: drawFace(-8, false),
      right: drawFace(8, false),
      leftBlink: drawFace(-8, true),
      rightBlink: drawFace(8, true),
    },
    width: frameW,
    height,
    x: 0,
    y: 0,
  }
}
