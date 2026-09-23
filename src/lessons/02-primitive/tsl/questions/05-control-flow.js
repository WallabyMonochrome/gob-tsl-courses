import { Fn, If, Loop, color, float, mix, select, uniform, uv, vec3 } from 'three/tsl'

// TSL decrit un graphe, pas une suite d'instructions. Pour retrouver du controle
// de flux il faut passer par ses versions node : toVar() rend une valeur
// reassignable, If() / Loop() ecrivent dans le shader, select() reste une
// expression (l'equivalent d'un ternaire).

export const order = ['fnAndVar', 'loopRings', 'selectThreshold']

const RING_COUNT = 5

const gain = uniform(2)
const ceiling = uniform(1)

// un Fn() est une fonction du shader : elle prend des nodes et renvoie un node
const buildIntensity = Fn(([value]) => {
  const intensity = float(value).toVar()

  intensity.mulAssign(gain)

  If(intensity.greaterThan(ceiling), () => {
    intensity.assign(ceiling)
  })

  return intensity
})

export const fnAndVar = ({ gui }) => {
  gui.add(gain, 'value', 0, 6, 0.01).name('gain')
  gui.add(ceiling, 'value', 0, 1, 0.01).name('plafond')

  const intensity = buildIntensity(uv().x)

  return { colorNode: vec3(intensity, intensity.mul(0.35), intensity.oneMinus()) }
}

// Loop() ecrit une vraie boucle dans le shader, son compteur `i` est un node int
export const loopRings = ({ gui }) => {
  const spacing = uniform(0.16)
  const thickness = uniform(0.04)

  gui.add(spacing, 'value', 0.05, 0.4, 0.001).name('espacement')
  gui.add(thickness, 'value', 0.005, 0.15, 0.001).name('epaisseur')

  const rings = Fn(() => {
    const total = float(0).toVar()

    Loop(RING_COUNT, ({ i }) => {
      const center = float(i).mul(spacing).add(0.1)
      const distance = uv().y.sub(center).abs()

      total.addAssign(distance.smoothstep(0, thickness).oneMinus())
    })

    return total.clamp(0, 1)
  })

  return { colorNode: mix(color('#101216'), color('#ffd166'), rings()) }
}

// select() ne branche pas le shader : les deux couleurs sont evaluees, une seule
// est gardee. C'est ce qu'on veut pour un simple choix de valeur.
export const selectThreshold = ({ gui }) => {
  const threshold = uniform(0.5)
  const softness = uniform(0)

  gui.add(threshold, 'value', 0, 1, 0.01).name('seuil')
  gui.add(softness, 'value', 0, 1, 0.01).name('fondu vers mix()')

  const hot = color('#ff4400')
  const cold = color('#0044ff')

  const hard = select(uv().x.greaterThan(threshold), hot, cold)

  return { colorNode: mix(hard, mix(cold, hot, uv().x), softness) }
}
