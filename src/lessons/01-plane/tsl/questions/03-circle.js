import { Fn, uv } from 'three/tsl'

import { TODO_PLACEHOLDER } from '../constant.js'

export const order = [
  'distanceField',
  'smoothCircle',
  'invertedCircle',
]

export const distanceField = Fn(() => {
  const coords = uv().sub(0.5)

  return TODO_PLACEHOLDER
})

export const smoothCircle = Fn(() => {
  const coords = uv().sub(0.5)

  return TODO_PLACEHOLDER
})

export const invertedCircle = Fn(() => {
  const coords = uv().sub(0.5)

  return TODO_PLACEHOLDER
})
