import { Fn, PI, atan, color, mix, uv, vec2 } from 'three/tsl'

const background = color('#ffffff')
const ink = color('#111111')

const TAU = PI.mul(2)

export const nestedArcs = Fn(() => {
  const dist = uv().sub(vec2(-0.4, 0.5)).length()

  const rings = dist.mul(14).fract()
  const mask = rings.smoothstep(0.45, 0.55)

  return mix(background, ink, mask)
})

export const opArtRings = Fn(() => {
  const coords = uv().sub(0.5)

  const angle = atan(coords.y, coords.x)
  const dist = coords.length()

  const warped = dist.add(angle.mul(9).sin().mul(0.035))

  const rings = warped.mul(18).fract()
  const mask = rings.smoothstep(0.4, 0.6)

  return mix(background, ink, mask)
})

export const bulgeGrid = Fn(() => {
  const coords = uv().sub(0.5)

  const dist = coords.length()

  const push = dist.smoothstep(0.0, 0.5).oneMinus().mul(0.18)
  const direction = coords.div(dist.max(0.001))
  const distorted = coords.add(direction.mul(push)).add(0.5)

  const cell = distorted.mul(12).floor()
  const parity = cell.x.add(cell.y).mod(2)

  return mix(ink, background, parity)
})

export const moire = Fn(() => {
  const coords = uv()

  const a = coords.x.mul(TAU).mul(60).sin()
  const b = coords.sub(0.5).length().mul(TAU).mul(58).sin()

  const mask = a.mul(b).smoothstep(-0.1, 0.1)

  return mix(background, ink, mask)
})
