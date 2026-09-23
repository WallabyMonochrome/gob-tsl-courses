import { Fn, PI, color, mix, uv } from 'three/tsl'

const dark = color('#1d3557')
const light = color('#f1faee')
const accent = color('#e9c46a')

const CELLS = 8

export const checkerboard = Fn(() => {
  const cell = uv().mul(CELLS).floor()

  const isDark = cell.x.add(cell.y).mod(2)

  return mix(dark, light, isDark)
})

export const checkerboardThreeColors = Fn(() => {
  const cell = uv().mul(CELLS).floor()

  const index = cell.x.add(cell.y).mod(3)

  const toLight = index.min(1)
  const toAccent = index.sub(1).max(0)

  return mix(mix(dark, light, toLight), accent, toAccent)
})

