import { Fn, color, mix, smoothstep, step, uv } from 'three/tsl'

const left = color('#e63946')
const right = color('#f1faee')
const middle = color('#457b9d')

export const hardSplit = Fn(() => {
  const mask = step(0.5, uv().x)

  return mix(left, right, mask)
})

export const softSplit = Fn(() => {
  const mask = smoothstep(0.4, 0.6, uv().x)

  return mix(left, right, mask)
})

export const threeBandsHard = Fn(() => {
  const x = uv().x

  const firstEdge = step(0.33, x)
  const secondEdge = step(0.66, x)

  return mix(mix(left, middle, firstEdge), right, secondEdge)
})

export const threeBandsSoft = Fn(() => {
  const x = uv().x

  const firstEdge = smoothstep(0.31, 0.35, x)
  const secondEdge = smoothstep(0.5, 0.8, x)

  return mix(mix(left, middle, firstEdge), right, secondEdge)
})
