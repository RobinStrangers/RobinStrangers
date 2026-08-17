import { useEffect, useState } from 'react'
import { STRANGER_IMAGES } from '../../assets/strangers'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { preloadWalkSheet, type WalkSheet } from '../../lib/createWalkFrames'
import { preloadStrangerAssets } from '../../lib/preloadImages'
import { LoaderCity } from './LoaderCity'

const WORD = 'strangers'

const WALKERS = [
  { src: STRANGER_IMAGES.character_0014, dir: 1, delay: '0.95s', duration: '2.55s', bottom: '6%', scale: 0.26 },
  { src: STRANGER_IMAGES.character_0022, dir: -1, delay: '1.4s', duration: '2.35s', bottom: '4%', scale: 0.32 },
  { src: STRANGER_IMAGES.character_0026, dir: 1, delay: '1.85s', duration: '2.45s', bottom: '8%', scale: 0.22, extra: true },
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
      void preloadWalkSheet(walker.src)
        .then((sheet) => {
          if (!active) return
          setSheets((current) => {
            const next = [...current]
            next[index] = sheet
            return next
          })
        })
        .catch(() => undefined)
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

    const sequenceMs = reduced ? 700 : 4200
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
        <LoaderCity />
        <p className="loader-word" aria-label="strangers">
          {WORD.split('').map((letter, index) => (
            <span
              key={`${letter}-${index}`}
              className="loader-letter"
              style={{ animationDelay: reduced ? '0ms' : `${180 + index * 48}ms` }}
            >
              {letter}
            </span>
          ))}
        </p>
        {!reduced
          ? WALKERS.map((walker, index) => {
              const sheet = sheets[index]
              if (!sheet) return null
              return (
                <div
                  key={walker.src}
                  className={`loader-walker ${walker.dir < 0 ? 'goes-left' : 'goes-right'}${'extra' in walker && walker.extra ? ' is-extra' : ''}`}
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
      </div>
    </div>
  )
}
