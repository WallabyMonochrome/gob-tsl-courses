import { Fn, color, mix, uv, vec3 } from 'three/tsl'

const background = color('#1d3557')
const foreground = color('#f1faee')

export const distanceField = Fn(() => {
  const dist = uv().sub(0.5).length()

  return vec3(dist, dist, dist)
})


export const smoothCircle = Fn(() => {
  const dist = uv().sub(0.5).length()

  const mask = dist.smoothstep(0.28, 0.42).oneMinus()

  return mix(background, foreground, mask)
})

export const invertedCircle = Fn(() => {
  const dist = uv().sub(0.5).length()
  const mask = dist.smoothstep(0.28, 0.32)

  return mix(background, foreground, mask)
})
