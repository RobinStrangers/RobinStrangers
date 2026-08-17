import { useEffect, useState } from 'react'
import type { FacePose } from '../lib/createWalkFrames'

export function useFaceAnimation(active: boolean): FacePose {
  const [look, setLook] = useState<'center' | 'left' | 'right'>('center')
  const [blink, setBlink] = useState(false)

  useEffect(() => {
    if (!active) {
      setLook('center')
      setBlink(false)
      return
    }

    let blinkTimer = 0
    let lookTimer = 0
    let blinkOff = 0

    const scheduleBlink = () => {
      blinkTimer = window.setTimeout(() => {
        setBlink(true)
        blinkOff = window.setTimeout(() => {
          setBlink(false)
          scheduleBlink()
        }, 140)
      }, 1600 + Math.random() * 2600)
    }

    const scheduleLook = () => {
      lookTimer = window.setTimeout(() => {
        setLook((current) => {
          const options: Array<'center' | 'left' | 'right'> = ['center', 'left', 'right'].filter(
            (item) => item !== current,
          ) as Array<'center' | 'left' | 'right'>
          return options[Math.floor(Math.random() * options.length)]
        })
        scheduleLook()
      }, 2400 + Math.random() * 3200)
    }

    scheduleBlink()
    scheduleLook()

    return () => {
      window.clearTimeout(blinkTimer)
      window.clearTimeout(lookTimer)
      window.clearTimeout(blinkOff)
    }
  }, [active])

  if (blink && look === 'left') return 'leftBlink'
  if (blink && look === 'right') return 'rightBlink'
  if (blink) return 'blink'
  return look
}
