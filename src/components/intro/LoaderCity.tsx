type LoaderBuilding = {
  left: string
  width: string
  height: string
  cols: number
  rows: number
  crown: 'flat' | 'step' | 'spire' | 'tank'
}

const BLOCK: LoaderBuilding[] = [
  { left: '1%', width: '7%', height: '34%', cols: 3, rows: 6, crown: 'flat' },
  { left: '8.5%', width: '5.5%', height: '58%', cols: 2, rows: 11, crown: 'spire' },
  { left: '14.5%', width: '10%', height: '41%', cols: 4, rows: 8, crown: 'step' },
  { left: '25%', width: '6%', height: '26%', cols: 3, rows: 5, crown: 'tank' },
  { left: '31.5%', width: '8%', height: '66%', cols: 3, rows: 13, crown: 'spire' },
  { left: '40%', width: '11%', height: '38%', cols: 4, rows: 7, crown: 'step' },
  { left: '51.5%', width: '5%', height: '52%', cols: 2, rows: 10, crown: 'flat' },
  { left: '57%', width: '12%', height: '32%', cols: 5, rows: 6, crown: 'tank' },
  { left: '69.5%', width: '6.5%', height: '72%', cols: 2, rows: 14, crown: 'spire' },
  { left: '76.5%', width: '9%', height: '46%', cols: 3, rows: 9, crown: 'step' },
  { left: '86%', width: '7%', height: '29%', cols: 3, rows: 5, crown: 'flat' },
  { left: '93.5%', width: '5.5%', height: '54%', cols: 2, rows: 10, crown: 'spire' },
]

export function LoaderCity() {
  return (
    <div className="loader-city" aria-hidden="true">
      <div className="loader-sky" />
      <div className="loader-moon" />
      <div className="loader-block">
        {BLOCK.map((building) => (
          <div
            key={`${building.left}-${building.height}`}
            className={`loader-building crown-${building.crown}`}
            style={{
              left: building.left,
              width: building.width,
              height: building.height,
              ['--cols' as string]: String(building.cols),
              ['--rows' as string]: String(building.rows),
            }}
          >
            {building.crown === 'step' ? <span className="loader-setback" /> : null}
            {building.crown === 'spire' ? <span className="loader-mast" /> : null}
            {building.crown === 'tank' ? <span className="loader-tank" /> : null}
            {building.crown === 'flat' ? <span className="loader-cap" /> : null}
            <span className="loader-windows" />
            <span className="loader-base" />
          </div>
        ))}
      </div>
      <div className="loader-pavement" />
      <div className="loader-curb" />
    </div>
  )
}
