import { useReducedMotion } from '../../hooks/useReducedMotion'

function Plane() {
  return (
    <svg viewBox="0 0 220 70" className="sky-craft-svg" aria-hidden="true">
      <path
        d="M18 34 C28 28, 48 26, 86 27 L148 28 C168 28, 188 30, 204 35 C188 39, 168 41, 148 41 L86 42 C48 43, 28 41, 18 36 Z"
        fill="#FC6224"
      />
      <path d="M196 32 C208 34, 216 35, 214 36 C216 37, 206 38, 196 39 Z" fill="#FC6224" />
      <path d="M158 29 C176 22, 186 20, 190 22 C182 27, 170 30, 158 31 Z" fill="#1C1C1C" />
      <path d="M78 40 L138 41 L118 64 L72 63 Z" fill="#FC6224" />
      <path d="M96 52 L122 53 L118 60 L94 59 Z" fill="#1C1C1C" />
      <path d="M36 28 L52 14 L68 16 L58 30 Z" fill="#FC6224" />
      <path d="M28 30 L18 16 L30 20 L40 32 Z" fill="#FC6224" />
      <path d="M24 36 L12 48 L28 44 L40 38 Z" fill="#FC6224" />
    </svg>
  )
}

function Helicopter() {
  return (
    <svg viewBox="0 0 180 80" className="sky-craft-svg" aria-hidden="true">
      <ellipse className="heli-rotor" cx="102" cy="16" rx="70" ry="3.2" fill="#FC6224" />
      <rect x="100" y="16" width="4" height="10" fill="#FC6224" />
      <path
        d="M134 32 C134 24, 122 20, 102 20 C82 20, 64 24, 56 32 L12 36 C8 36, 6 38, 8 40 L56 42 C62 50, 80 54, 102 54 C124 54, 140 48, 142 40 C148 40, 152 38, 150 36 Z"
        fill="#FC6224"
      />
      <ellipse cx="108" cy="36" rx="16" ry="10" fill="#1C1C1C" />
      <path d="M56 38 L12 34 L10 38 L56 42 Z" fill="#FC6224" />
      <rect x="12" y="28" width="2" height="16" fill="#FC6224" />
      <ellipse className="heli-tail-rotor" cx="10" cy="28" rx="7" ry="2" fill="#FC6224" />
      <path d="M128 54 L134 66 L122 66 L120 54 Z" fill="#FC6224" />
      <path d="M84 54 L82 66 L70 66 L76 54 Z" fill="#FC6224" />
      <path d="M68 66 H136" stroke="#FC6224" strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}

export function SkyTraffic() {
  const reduced = useReducedMotion()
  const live = reduced ? '' : 'is-alive'

  return (
    <div className="sky-traffic">
      <div className={`sky-plane p1 ${live}`}>
        <Plane />
      </div>
      <div className={`sky-plane p2 ${live}`}>
        <Plane />
      </div>
      <div className={`sky-plane p3 ${live}`}>
        <Plane />
      </div>
      <div className={`sky-heli h1 ${live}`}>
        <Helicopter />
      </div>
      <div className={`sky-heli h2 ${live}`}>
        <Helicopter />
      </div>
      <div className={`sky-heli h3 ${live}`}>
        <Helicopter />
      </div>
    </div>
  )
}
