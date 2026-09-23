import { Fn, PI, color, mix, uv } from 'three/tsl'

const background = color('#f1faee')
const ink = color('#e63946')
const accent = color('#1d3557')


export const targetTwoColors = Fn(() => {
  const dist = uv().sub(0.5).length()

  const circles = dist.mul(6).floor().mod(2)

  return mix(ink, accent, circles)
})
