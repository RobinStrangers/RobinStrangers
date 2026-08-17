import { useEffect, useRef, useState, type RefObject } from 'react'
import { DEPTH, MOVEMENT, walkTransform, type DepthLevel } from '../config/constants'
import { useReducedMotion } from './useReducedMotion'

type MovementOptions = {
  speed: number
  direction: 1 | -1
  spawnDelay: number
  startX: number
  depth: DepthLevel
  nodeRef: RefObject<HTMLDivElement | null>
}

export type CharacterPose = {
  direction: 1 | -1
  walking: boolean
  visible: boolean
}

export function useCharacterMovement({
  speed,
  direction,
  spawnDelay,
  startX,
  depth,
  nodeRef,
}: MovementOptions): CharacterPose {
  const reduced = useReducedMotion()
  const [pose, setPose] = useState<CharacterPose>({
    direction,
    walking: false,
    visible: false,
  })

  const dirRef = useRef(direction)
  const waitingRef = useRef(true)
  const pauseUntilRef = useRef(0)
  const nextPauseRef = useRef(0)
  const spawnAtRef = useRef(0)
  const lastRef = useRef(0)
  const xRef = useRef(startX)
  const walkingRef = useRef(false)
  const visibleRef = useRef(false)

  useEffect(() => {
    spawnAtRef.current = performance.now() + spawnDelay
    waitingRef.current = true
    dirRef.current = direction
    xRef.current = startX
    walkingRef.current = false
    visibleRef.current = false
    nextPauseRef.current = performance.now() + spawnDelay + 3200 + Math.random() * 5000
    lastRef.current = performance.now()

    const profile = DEPTH[depth]
    let frame = 0

    const applyTransform = (x: number, nextDirection: 1 | -1, visible: boolean) => {
      const node = nodeRef.current
      if (!node) return
      const scale = profile.scale * (window.innerWidth < 768 ? 0.78 : 1)
      node.style.transform = walkTransform(x, nextDirection * scale, scale)
      node.style.opacity = visible ? '1' : '0'
    }

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - lastRef.current) / 1000)
      lastRef.current = now

      if (waitingRef.current) {
        if (now >= spawnAtRef.current) {
          waitingRef.current = false
          walkingRef.current = true
          visibleRef.current = true
          applyTransform(xRef.current, dirRef.current, true)
          setPose({
            direction: dirRef.current,
            walking: true,
            visible: true,
          })
        }
        frame = window.requestAnimationFrame(tick)
        return
      }

      const paused = now < pauseUntilRef.current
      const walking = !paused
      const depthSpeed = DEPTH[depth].speedScale
      const motionScale = reduced ? 0.45 : 1
      let x = xRef.current
      let nextDirection = dirRef.current

      if (walking) {
        x +=
          nextDirection *
          speed *
          depthSpeed *
          motionScale *
          dt *
          (100 / Math.max(window.innerWidth, 1)) *
          MOVEMENT.TRAVEL

        if (!reduced && now > nextPauseRef.current && x > 18 && x < 82) {
          pauseUntilRef.current = now + 160 + Math.random() * 220
          nextPauseRef.current = pauseUntilRef.current + 5200 + Math.random() * 4800
        }
      }

      if (x > MOVEMENT.EXIT || x < MOVEMENT.ENTER) {
        waitingRef.current = true
        const delay = reduced ? 1200 : 800 + Math.random() * 2800
        spawnAtRef.current = now + delay
        nextDirection = Math.random() > 0.5 ? 1 : -1
        dirRef.current = nextDirection
        x = nextDirection === 1 ? MOVEMENT.ENTER : MOVEMENT.EXIT
        xRef.current = x
        walkingRef.current = false
        visibleRef.current = false
        applyTransform(x, nextDirection, false)
        setPose({
          direction: nextDirection,
          walking: false,
          visible: false,
        })
        frame = window.requestAnimationFrame(tick)
        return
      }

      xRef.current = x
      applyTransform(x, nextDirection, true)

      if (walkingRef.current !== walking || visibleRef.current !== true) {
        walkingRef.current = walking
        visibleRef.current = true
        setPose({
          direction: nextDirection,
          walking,
          visible: true,
        })
      }

      frame = window.requestAnimationFrame(tick)
    }

    frame = window.requestAnimationFrame(tick)
    return () => window.cancelAnimationFrame(frame)
  }, [depth, direction, nodeRef, reduced, spawnDelay, speed, startX])

  return pose
}
