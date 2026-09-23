import { Fn, PI, color, mix, uv } from 'three/tsl'

const background = color('#22223b')
const foreground = color('#f2e9e4')

export const thinStripes = Fn(() => {
  const pattern = uv().x.mul(30).fract().step(0.75)

  return mix(background, foreground, pattern)
})



export const wavyStripes = Fn(() => {
  const coords = uv()

  //const offset = coords.y.mul(PI.mul(2)).mul(2).sin().mul(0.1)
  const offset = coords.y.mul(PI.mul(2)).mul(1).sin().mul(0.1)
  const pattern = coords.x.add(offset).mul(10).fract().step(0.5)

  return mix(background, foreground, pattern)
})
