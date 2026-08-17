import { useReducedMotion } from '../../hooks/useReducedMotion'

type Building = {
  x: number
  w: number
  h: number
  spire?: boolean
  roof?: boolean
  cols: number
}

const FAR_CITY: Building[] = [
  { x: 0, w: 6, h: 22, cols: 3 },
  { x: 5.5, w: 4.5, h: 34, spire: true, cols: 2 },
  { x: 10, w: 7, h: 26, roof: true, cols: 4 },
  { x: 16.5, w: 5, h: 48, spire: true, cols: 2 },
  { x: 21.5, w: 8, h: 30, cols: 4 },
  { x: 29, w: 4, h: 20, cols: 2 },
  { x: 33, w: 6.5, h: 40, roof: true, cols: 3 },
  { x: 39.5, w: 9, h: 28, cols: 5 },
  { x: 48, w: 5, h: 52, spire: true, cols: 2 },
  { x: 53, w: 7, h: 24, cols: 3 },
  { x: 60, w: 4.5, h: 36, cols: 2 },
  { x: 64.5, w: 8, h: 44, roof: true, cols: 4 },
  { x: 72.5, w: 5.5, h: 22, cols: 3 },
  { x: 78, w: 6, h: 38, spire: true, cols: 3 },
  { x: 84, w: 9, h: 27, cols: 5 },
  { x: 93, w: 4, h: 46, spire: true, cols: 2 },
  { x: 97, w: 3, h: 18, cols: 1 },
]

export function BackgroundLayer() {
  const reduced = useReducedMotion()
  const live = reduced ? '' : 'is-alive'

  return (
    <div className="absolute inset-0">
      <div className={`far-orb ${live}`} />
      <div className={`city-far ${live}`}>
        {FAR_CITY.map((building) => (
          <div
            key={`${building.x}-${building.h}`}
            className="city-building far"
            style={{
              left: `${building.x}%`,
              width: `${building.w}%`,
              height: `${building.h}%`,
            }}
          >
            {building.spire ? <span className="city-spire" /> : null}
            {building.roof ? <span className="city-roof" /> : null}
            <span className="city-windows" style={{ backgroundSize: `${100 / building.cols}% 11px` }} />
          </div>
        ))}
      </div>
      <div className={`drift-cloud a ${live}`} />
      <div className={`drift-cloud b ${live}`} />
      <div className={`drift-cloud c ${live}`} />
    </div>
  )
}
