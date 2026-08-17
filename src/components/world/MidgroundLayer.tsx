import { useReducedMotion } from '../../hooks/useReducedMotion'

const NEAR_CITY = [
  { x: 2, w: 11, h: 34, cols: 4 },
  { x: 14, w: 8, h: 46, cols: 3 },
  { x: 23, w: 13, h: 28, cols: 5 },
  { x: 58, w: 10, h: 40, cols: 4 },
  { x: 70, w: 14, h: 32, cols: 5 },
  { x: 86, w: 9, h: 44, cols: 3 },
]

export function MidgroundLayer() {
  const reduced = useReducedMotion()
  const live = reduced ? '' : 'is-alive'

  return (
    <div className="absolute inset-0">
      <div className={`city-near ${live}`}>
        {NEAR_CITY.map((building) => (
          <div
            key={`${building.x}-${building.h}`}
            className="city-building near"
            style={{
              left: `${building.x}%`,
              width: `${building.w}%`,
              height: `${building.h}%`,
            }}
          >
            <span className="city-ledge" />
            <span className="city-windows dense" style={{ backgroundSize: `${100 / building.cols}% 13px` }} />
            <span className="city-door" />
          </div>
        ))}
      </div>
      <div className="street-plane" />
      <div className="street-line" />
      <div className="street-curb" />
    </div>
  )
}
