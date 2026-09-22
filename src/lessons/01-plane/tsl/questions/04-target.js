import { Fn, uv, color } from 'three/tsl'

import { TODO_PLACEHOLDER } from '../constant.js'

const background = color('#f1faee')
const ink = color('#e63946')
const accent = color('#1d3557')


export const targetTwoColors = Fn(() => {
  const dist = uv().sub(0.5).length()

  return TODO_PLACEHOLDER
})
