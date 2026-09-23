import { Fn, PI, color, mix, uv } from 'three/tsl'

const background = color('#0d1b2a')
const line = color('#e0e1dd')
const lineB = color('#f4a259')

const TAU = PI.mul(2)

export const waveLine = Fn(() => {
  const coords = uv()

  const wave = coords.x.mul(TAU).mul(2).sin().mul(0.15).add(0.5)

  const dist = coords.y.sub(wave).abs()
  const mask = dist.smoothstep(0.01, 0.025).oneMinus()

  return mix(background, line, mask)
})

export const multipleWaves = Fn(() => {
  const coords = uv()

  let result = background

  for (let i = 0; i < 5; i++) {
    const offset = 0.15 + i * 0.175
    const wave = coords.x.mul(TAU).mul(2).sin().mul(0.06).add(offset)

    const dist = coords.y.sub(wave).abs()
    const mask = dist.smoothstep(0.008, 0.02).oneMinus()

    result = mix(result, i % 2 === 0 ? line : lineB, mask)
  }

  return result
})

export const interference = Fn(() => {
  const coords = uv()

  const waveA = coords.x.mul(TAU).mul(6).sin()
  const waveB = coords.x.mul(TAU).mul(6.7).sin()

  const wave = waveA.add(waveB).mul(0.1).add(0.5)

  const dist = coords.y.sub(wave).abs()
  const mask = dist.smoothstep(0.01, 0.03).oneMinus()

  return mix(background, line, mask)
})

export const variableFrequency = Fn(() => {
  const coords = uv()

  const frequency = coords.x.mul(20).add(2)
  const wave = coords.x.mul(TAU).mul(frequency).sin().mul(0.15).add(0.5)

  const dist = coords.y.sub(wave).abs()
  const mask = dist.smoothstep(0.01, 0.03).oneMinus()

  return mix(background, line, mask)
})

export const waveField = Fn(() => {
  const coords = uv()

  const wave = coords.x.mul(TAU).mul(4).add(coords.y.mul(TAU).mul(2)).sin()
  const mask = wave.smoothstep(-0.2, 0.2)

  return mix(background, line, mask)
})
