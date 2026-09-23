import {
  cameraPosition,
  color,
  float,
  mix,
  modelPosition,
  normalLocal,
  normalView,
  normalWorld,
  positionGeometry,
  positionLocal,
  positionView,
  positionWorld,
  uniform,
  uv,
  varying,
  vec3,
  vertexIndex,
} from 'three/tsl'

// Les variables fournies par TSL. Aucune n'est a declarer : ce sont des nodes
// deja branches sur la geometrie, le mesh ou la camera. Le menu `variable`
// rebranche le graphe pour comparer les espaces entre eux.

export const order = ['uvCoords', 'positions', 'normals', 'cameraFacing', 'indices']

const POSITIONS = { positionGeometry, positionLocal, positionWorld, positionView, modelPosition }
const NORMALS = { normalLocal, normalWorld, normalView }

// l'etat des menus survit au rebuild que leur propre onChange declenche
const positionState = { source: 'positionLocal', offsetX: 0 }
const normalState = { source: 'normalLocal', spin: 0.5 }

// une valeur signee (-1 → 1) ramenee dans 0 → 1, sinon la moitie est ecretee a noir
const toColor = (node) => node.mul(0.5).add(0.5)

// uv() : les coordonnees de texture, 0 → 1 sur la surface
export const uvCoords = ({ gui }) => {
  const tiling = uniform(1)

  gui.add(tiling, 'value', 1, 8, 1).name('tiling')

  const coords = uv().mul(tiling).fract()

  return { colorNode: vec3(coords.x, coords.y, 0) }
}

// Bouger le mesh ne change que positionWorld / positionView / modelPosition :
// positionGeometry et positionLocal restent attaches a la geometrie.
export const positions = ({ gui, mesh, rebuild }) => {
  mesh.position.x = positionState.offsetX

  gui.add(positionState, 'source', Object.keys(POSITIONS)).name('variable').onChange(rebuild)
  gui
    .add(positionState, 'offsetX', -2, 2, 0.01)
    .name('mesh.position.x')
    .onChange((value) => {
      mesh.position.x = value
    })

  return { colorNode: toColor(POSITIONS[positionState.source]) }
}

// En rotation, normalLocal reste peinte sur la sphere tandis que normalWorld
// reste fixe dans la scene. normalView bouge en plus avec l'orbite de la camera.
export const normals = ({ gui, motion, rebuild }) => {
  motion.spin = normalState.spin

  gui.add(normalState, 'source', Object.keys(NORMALS)).name('variable').onChange(rebuild)
  gui
    .add(normalState, 'spin', 0, 2, 0.01)
    .name('rotation')
    .onChange((value) => {
      motion.spin = value
    })

  return { colorNode: toColor(NORMALS[normalState.source]) }
}

// positionWorld + cameraPosition donnent la direction surface → camera, la base
// de tous les effets de fresnel.
export const cameraFacing = ({ gui }) => {
  const power = uniform(3)

  gui.add(power, 'value', 0.5, 8, 0.01).name('power')

  const toCamera = cameraPosition.sub(positionWorld).normalize()
  const rim = normalWorld.dot(toCamera).clamp(0, 1).oneMinus().pow(power)

  return { colorNode: mix(color('#101216'), color('#7ce3ff'), rim) }
}

// vertexIndex numerote les sommets. instanceIndex ferait pareil pour les copies
// d'un InstancedMesh, qui n'en a qu'une ici.
export const indices = ({ gui }) => {
  const density = uniform(0.02)

  gui.add(density, 'value', 0.002, 0.2, 0.002).name('densite')

  // l'index n'existe que dans le vertex stage : varying() le transporte au fragment
  const id = varying(float(vertexIndex), 'vIndex')
  const stripes = id.mul(density).fract()

  return { colorNode: vec3(stripes, stripes.oneMinus(), 0.35) }
}
