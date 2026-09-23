import { Fn, color, mix, uv, vec2 } from 'three/tsl'

const background = color('#0b132b')
const foreground = color('#5bc0be')

const CELLS = 5

export const tiledCircles = Fn(() => {
  const grid = uv().mul(CELLS)

  const local = grid.fract()
  const dist = local.sub(0.5).length()

  const circle = dist.smoothstep(0.24, 0.26).oneMinus()

  return mix(background, foreground, circle)
})

export const sizeByColumn = Fn(() => {
  const grid = uv().mul(CELLS)

  const cell = grid.floor()
  const local = grid.fract()
  const dist = local.sub(0.5).length()

  const radius = cell.x.div(CELLS).mul(0.3).add(0.08)
  const circle = dist.smoothstep(radius, radius.add(0.02)).oneMinus()

  return mix(background, foreground, circle)
})

export const alternateCircleAndRing = Fn(() => {
  const grid = uv().mul(CELLS)

  const cell = grid.floor()
  const local = grid.fract()
  const dist = local.sub(0.5).length()

  const disc = dist.smoothstep(0.24, 0.26).oneMinus()

  const ring = dist.sub(0.28).abs().smoothstep(0.03, 0.05).oneMinus()

  const parity = cell.x.add(cell.y).mod(2)
  const shape = mix(disc, ring, parity)

  return mix(background, foreground, shape)
})

export const offsetRows = Fn(() => {
  const scaled = uv().mul(CELLS)

  const row = scaled.y.floor()
  const offset = row.mod(2).mul(0.5)

  const grid = vec2(scaled.x.add(offset), scaled.y)
  const dist = grid.fract().sub(0.5).length()

  const circle = dist.smoothstep(0.24, 0.26).oneMinus()

  return mix(background, foreground, circle)
})
