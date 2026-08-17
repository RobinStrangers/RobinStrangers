import { useEffect, useState } from 'react'
import { STRANGER_IMAGE_LIST } from '../../assets/strangers'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { preloadWalkSheet, type WalkSheet } from '../../lib/createWalkFrames'
import { preloadStrangerAssets } from '../../lib/preloadImages'

const WORD = 'STRANGERS'
const WALKERS = [
  { src: STRANGER_IMAGE_LIST[1], delay: '0.1s', duration: '2.7s', bottom: '20%', scale: 0.34, dir: 1 },
  { src: STRANGER_IMAGE_LIST[3], delay: '0.7s', duration: '2.55s', bottom: '16%', scale: 0.4, dir: -1 },
  { src: STRANGER_IMAGE_LIST[6], delay: '1.2s', duration: '2.85s', bottom: '25%', scale: 0.28, dir: 1 },
  { src: STRANGER_IMAGE_LIST[0], delay: '1.8s', duration: '2.45s', bottom: '14%', scale: 0.46, dir: 1 },
]

type SiteLoaderProps = {
  onFinished: () => void
}

export function SiteLoader({ onFinished }: SiteLoaderProps) {
  const reduced = useReducedMotion()
  const [closing, setClosing] = useState(false)
  const [sheets, setSheets] = useState<Array<WalkSheet | null>>(() => WALKERS.map(() => null))

  useEffect(() => {
    let active = true
    WALKERS.forEach((walker, index) => {
      void preloadWalkSheet(walker.src).then((sheet) => {
        if (!active) return
        setSheets((current) => {
          const next = [...current]
          next[index] = sheet
          return next
        })
      })
    })
    return () => {
      active = false
    }
  }, [])

  useEffect(() => {
    let assetsReady = false
    let sequenceDone = false
    let finished = false

    const finish = () => {
      if (finished || !assetsReady || !sequenceDone) return
      finished = true
      setClosing(true)
      window.setTimeout(onFinished, reduced ? 280 : 820)
    }

    void preloadStrangerAssets()
      .catch(() => undefined)
      .finally(() => {
        assetsReady = true
        finish()
      })

    const sequenceMs = reduced ? 700 : 5200
    const sequenceTimer = window.setTimeout(() => {
      sequenceDone = true
      finish()
    }, sequenceMs)

    const failsafe = window.setTimeout(() => {
      assetsReady = true
      sequenceDone = true
      finish()
    }, 8000)

    return () => {
      window.clearTimeout(sequenceTimer)
      window.clearTimeout(failsafe)
    }
  }, [onFinished, reduced])

  return (
    <div className={`site-loader ${closing ? 'is-closing' : ''} ${reduced ? 'is-reduced' : ''}`}>
      <div className="loader-shutter top" />
      <div className="loader-shutter bottom" />
      <div className="loader-stage">
        <div className="loader-embers" aria-hidden="true">
          {Array.from({ length: 28 }, (_, index) => (
            <span key={index} className={`loader-ember e-${index + 1}`} />
          ))}
        </div>
        {!reduced
          ? WALKERS.map((walker, index) => {
              const sheet = sheets[index]
              if (!sheet) return null
              return (
                <div
                  key={walker.src}
                  className={`loader-walker ${walker.dir < 0 ? 'goes-left' : 'goes-right'}`}
                  style={{
                    bottom: walker.bottom,
                    animationDelay: walker.delay,
                    animationDuration: walker.duration,
                    ['--walker-scale' as string]: String(walker.scale),
                  }}
                >
                  <div className="sprite-viewport" style={{ width: sheet.frameWidth, height: sheet.frameHeight }}>
                    <img
                      className="sprite-strip is-playing"
                      src={sheet.url}
                      alt=""
                      draggable={false}
                      width={sheet.frameWidth * sheet.frameCount}
                      height={sheet.frameHeight}
                      style={{ animationDuration: `${sheet.durationMs}ms` }}
                    />
                  </div>
                </div>
              )
            })
          : null}
        <p className="loader-word" aria-label="STRANGERS">
          {WORD.split('').map((letter, index) => (
            <span
              key={`${letter}-${index}`}
              className="loader-letter"
              style={{ animationDelay: reduced ? `${index * 40}ms` : `${480 + index * 260}ms` }}
            >
              {letter}
            </span>
          ))}
        </p>
      </div>
    </div>
  )
}
