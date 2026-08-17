import { useReducedMotion } from '../../hooks/useReducedMotion'

type Building = {
  x: number
  w: number
  h: number
  cols: number
  rows: number
  crown?: 'spire' | 'step' | 'cap'
}

const FAR_CITY: Building[] = [
  { x: 0, w: 6, h: 22, cols: 3, rows: 5, crown: 'cap' },
  { x: 5.5, w: 4.5, h: 34, cols: 2, rows: 8, crown: 'spire' },
  { x: 10, w: 7, h: 26, cols: 4, rows: 6, crown: 'step' },
  { x: 16.5, w: 5, h: 48, cols: 2, rows: 11, crown: 'spire' },
  { x: 21.5, w: 8, h: 30, cols: 4, rows: 7, crown: 'cap' },
  { x: 29, w: 4, h: 20, cols: 2, rows: 4 },
  { x: 33, w: 6.5, h: 40, cols: 3, rows: 9, crown: 'step' },
  { x: 39.5, w: 9, h: 28, cols: 5, rows: 6, crown: 'cap' },
  { x: 48, w: 5, h: 52, cols: 2, rows: 12, crown: 'spire' },
  { x: 53, w: 7, h: 24, cols: 3, rows: 5 },
  { x: 60, w: 4.5, h: 36, cols: 2, rows: 8, crown: 'cap' },
  { x: 64.5, w: 8, h: 44, cols: 4, rows: 10, crown: 'step' },
  { x: 72.5, w: 5.5, h: 22, cols: 3, rows: 5 },
  { x: 78, w: 6, h: 38, cols: 3, rows: 8, crown: 'spire' },
  { x: 84, w: 9, h: 27, cols: 5, rows: 6, crown: 'cap' },
  { x: 93, w: 4, h: 46, cols: 2, rows: 10, crown: 'spire' },
  { x: 97, w: 3, h: 18, cols: 1, rows: 4 },
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
            {building.crown === 'spire' ? <span className="city-spire" /> : null}
            {building.crown === 'step' ? <span className="city-setback" /> : null}
            {building.crown === 'cap' ? <span className="city-roof" /> : null}
            <span
              className="city-windows"
              style={{ backgroundSize: `${100 / building.cols}% ${100 / building.rows}%` }}
            />
            <span className="city-plinth" />
          </div>
        ))}
      </div>
      <div className={`drift-cloud a ${live}`} />
      <div className={`drift-cloud b ${live}`} />
      <div className={`drift-cloud c ${live}`} />
    </div>
  )
}
