import { Fn, PI, color, mix, uv, vec2 } from 'three/tsl'

const night = color('#17203d')
const dusk = color('#3b2a58')
const amber = color('#f4a259')
const ember = color('#e76f51')
const cream = color('#f2e9e4')
const ink = color('#0b0f1f')

const TAU = PI.mul(2)

export const proceduralPoster = Fn(() => {
  const coords = uv()

  // 1 — fond : degrade vertical entre deux bleus
  let result = mix(night, dusk, coords.y)

  // 2 — etoiles : une pastille au centre de chaque cellule, effacee vers le bas
  const starDist = coords.mul(16).fract().sub(0.5).length()
  const star = starDist.smoothstep(0.06, 0.1).oneMinus()
  const starFade = coords.y.smoothstep(0.45, 0.95)
  result = mix(result, cream, star.mul(starFade))

  // 3 — halo : anneaux concentriques autour du soleil, attenues avec la distance
  const sunDist = coords.sub(vec2(0.5, 0.6)).length()
  const rings = sunDist.mul(12).fract().smoothstep(0.35, 0.5).oneMinus()
  const haloFade = sunDist.smoothstep(0.2, 0.55).oneMinus()
  result = mix(result, amber, rings.mul(haloFade).mul(0.6))

  // 4 — soleil : le disque passe par-dessus ses propres anneaux
  const sun = sunDist.smoothstep(0.17, 0.18).oneMinus()
  result = mix(result, amber, sun)

  // 5 — sol
  const ground = coords.y.smoothstep(0.4, 0.42).oneMinus()
  result = mix(result, ink, ground)

  // 6 — vagues dans le sol, de plus en plus serrees vers le bas
  const frequency = coords.y.oneMinus().mul(14).add(4)
  const wave = coords.x.mul(TAU).mul(3).add(coords.y.mul(frequency)).sin()
  result = mix(result, ember, wave.smoothstep(0.2, 0.6).mul(ground))

  // 7 — ligne d'horizon
  const horizon = coords.y.sub(0.41).abs().smoothstep(0.004, 0.006).oneMinus()
  result = mix(result, cream, horizon)

  return result
})
