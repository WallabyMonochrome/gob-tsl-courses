import { BufferAttribute } from 'three/webgpu'
import { attribute, color, mix, normalLocal, positionGeometry, positionLocal, uniform, varying, vec3 } from 'three/tsl'

// Les trois facons d'alimenter un graphe depuis le JS :
// uniform  → une valeur pour tout le mesh, modifiable a chaque frame
// attribute → une valeur par sommet, stockee dans la geometrie
// varying  → une valeur calculee dans le vertex, interpolee vers le fragment

export const order = ['uniformColor', 'attributeStrength', 'varyingWave']

const STRENGTH = 'strength'

// l'etat du slider survit au changement d'exercice, l'attribut est reecrit a la volee
const attributeState = { frequency: 6 }

function writeStrength(geometry, frequency) {
  const position = geometry.attributes.position

  let strength = geometry.getAttribute(STRENGTH)

  if (!strength || strength.count !== position.count) {
    strength = new BufferAttribute(new Float32Array(position.count), 1)
    geometry.setAttribute(STRENGTH, strength)
  }

  for (let i = 0; i < position.count; i++) {
    strength.setX(i, Math.sin(position.getY(i) * frequency) * 0.5 + 0.5)
  }

  strength.needsUpdate = true
}

// changer .value ne reconstruit rien : la nouvelle valeur part au GPU telle quelle
export const uniformColor = ({ gui }) => {
  const settings = { tint: '#ff4400' }

  const tint = uniform(color(settings.tint))
  const intensity = uniform(0.5)

  gui.addColor(settings, 'tint').onChange((value) => tint.value.set(value))
  gui.add(intensity, 'value', 0, 2, 0.01).name('intensity')

  return { colorNode: tint.mul(intensity) }
}

// un attribut est une donnee de la geometrie : le slider reecrit le Float32Array,
// le graphe TSL, lui, ne bouge pas
export const attributeStrength = ({ gui, geometry }) => {
  writeStrength(geometry, attributeState.frequency)

  gui
    .add(attributeState, 'frequency', 1, 20, 0.1)
    .name('frequency')
    .onChange((value) => writeStrength(geometry, value))

  const strength = attribute(STRENGTH, 'float')

  return { colorNode: vec3(strength, 0, strength.oneMinus()) }
}

// la meme onde sert deux fois : brute pour deplacer les sommets, en varying pour
// colorer les pixels entre eux
export const varyingWave = ({ gui }) => {
  const waves = uniform(6)
  const amplitude = uniform(0.12)

  gui.add(waves, 'value', 1, 20, 0.1).name('waves')
  gui.add(amplitude, 'value', 0, 0.4, 0.001).name('amplitude')

  const wave = positionGeometry.y.mul(waves).sin()
  const height = varying(wave, 'vWave')

  return {
    positionNode: positionLocal.add(normalLocal.mul(wave.mul(amplitude))),
    colorNode: mix(color('#1d3557'), color('#f1faee'), height.mul(0.5).add(0.5)),
  }
}
