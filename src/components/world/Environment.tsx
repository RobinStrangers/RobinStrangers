import { CHARACTERS } from '../../config/characters'
import { PARALLAX } from '../../config/constants'
import { Stranger } from '../characters/Stranger'
import type { ParallaxOffset } from '../../hooks/useParallax'
import { Atmosphere } from './Atmosphere'
import { BackgroundLayer } from './BackgroundLayer'
import { ForegroundLayer } from './ForegroundLayer'
import { MidgroundLayer } from './MidgroundLayer'
import { ParallaxLayer } from './ParallaxLayer'
import { ParticleLayer } from './ParticleLayer'
import { SkyTraffic } from './SkyTraffic'

type EnvironmentProps = {
  offset: ParallaxOffset
}

export function Environment({ offset }: EnvironmentProps) {
  return (
    <div className="environment">
      <ParallaxLayer factor={PARALLAX.ATMOSPHERE} offset={offset}>
        <Atmosphere />
      </ParallaxLayer>
      <ParallaxLayer factor={PARALLAX.FAR} offset={offset}>
        <BackgroundLayer />
        <SkyTraffic />
      </ParallaxLayer>
      <ParallaxLayer factor={PARALLAX.MID} offset={offset}>
        <MidgroundLayer />
      </ParallaxLayer>
      <ParallaxLayer factor={PARALLAX.CHARACTER} offset={offset} className="z-[30]">
        <div className="stranger-field">
          {CHARACTERS.map((character) => (
            <Stranger key={character.id} config={character} />
          ))}
        </div>
      </ParallaxLayer>
      <ParallaxLayer factor={PARALLAX.FORE} offset={offset}>
        <ForegroundLayer />
      </ParallaxLayer>
      <ParticleLayer offset={offset} />
    </div>
  )
}
