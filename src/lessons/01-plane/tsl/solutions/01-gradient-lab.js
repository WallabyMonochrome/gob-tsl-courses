import { Fn, color, mix, uv, vec3 } from 'three/tsl'

const colorA = color('#E43B3B')
const colorB = color('#2A7CDF')

export const horizontalGradient = Fn(() => {
  const coords = uv()

  return vec3(coords.x)
})

export const verticalGradient = Fn(() => {
  const coords = uv()

  return vec3(coords.y, coords.y, coords.y)
})

export const diagonalGradient = Fn(() => {
  const coords = uv()
  const diagonal = coords.x.add(coords.y).div(2)

  return vec3(diagonal, diagonal, diagonal)
})

export const rgbGradient = Fn(() => {
  const coords = uv()

  return vec3(coords.x, coords.y, coords.x.oneMinus())
})

export const twoColorGradient = Fn(() => {
  const coords = uv()

  return mix(colorA, colorB, coords.x)
})

export const curvedGradient = Fn(() => {
  const coords = uv()

  const curve = coords.x.pow(2)

  return mix(colorA, colorB, curve)
})
