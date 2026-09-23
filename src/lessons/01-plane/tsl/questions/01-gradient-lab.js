import { Fn, uv, color, mix, vec3 } from 'three/tsl'

import { TODO_PLACEHOLDER } from '../constant.js'

export const order = [
  'horizontalGradient',
  'verticalGradient',
  'diagonalGradient',
  'rgbGradient',
  'twoColorGradient',
  'curvedGradient',
]

const colorRed = color('#E43B3B')
const colorBlue = color('#2A7CDF')

export const rgbGradient = Fn(() => {
  const coords = uv()

  return vec3(coords.x, coords.y, coords.x.oneMinus())
})

export const horizontalGradient = Fn(() => {
  const coords = uv()

  return vec3(1, 0, 0);
})

export const verticalGradient = Fn(() => {
  const coords = uv()

  return TODO_PLACEHOLDER
})

export const diagonalGradient = Fn(() => {
  const coords = uv()

  return TODO_PLACEHOLDER
})

export const twoColorGradient = Fn(() => {
  const coords = uv()

  return TODO_PLACEHOLDER
})

// Quelle operation peut-on appeler pour "ecraser" une courbe ?
export const curvedGradient = Fn(() => {
  const coords = uv()

  return TODO_PLACEHOLDER
})
