import { Mesh, MeshStandardNodeMaterial, SphereGeometry, DirectionalLight, AmbientLight } from 'three/webgpu'
import { vec3 } from 'three/tsl'

import { createExerciseSelector } from '../exercise-selector.js'
import { registry } from './tsl/index.js'

const STORAGE_KEY = '02-primitive:selection'

const NODE_SLOTS = [
  'positionNode',
  'colorNode',
  'normalNode',
  'aoNode',
  'roughnessNode',
  'metalnessNode',
  'emissiveNode',
  'opacityNode',
  'outputNode',
]

const CAMERA_DISTANCE = 2.8

export default {
  id: '02-primitive',
  title: '02 — Primitive Mesh',

  setup({ group, gui, camera }) {
    // beaucoup de segments : de quoi deplacer les sommets plus tard sans facettes
    const geometry = new SphereGeometry(1, 128, 64)
    const material = new MeshStandardNodeMaterial()

    const mesh = new Mesh(geometry, material)
    group.add(mesh)

    const directionalLight = new DirectionalLight(0xffffff, 1)
    const ambientLight = new AmbientLight(0xffffff, 1)
    group.add(ambientLight)
    group.add(directionalLight)

    const previousCameraZ = camera.position.z
    camera.position.set(0, 0, CAMERA_DISTANCE)

    // un exercice peut demander une rotation continue pour comparer local / world / view
    const motion = { spin: 0 }

    let debug = null

    const apply = (state) => {
      const effect = registry.findEffect(state.exercise, state.effect)

      debug?.destroy()
      debug = gui.addFolder('Debug')

      // on repart d'une scene neutre : l'exercice repose ce dont il a besoin
      motion.spin = 0
      mesh.position.set(0, 0, 0)
      mesh.rotation.set(0, 0, 0)

      const context = { gui: debug, mesh, geometry, material, motion, rebuild: () => apply(state) }

      // un exercice ecrit en Fn() ne prend que des nodes, une fabrique JS recoit le contexte
      const result = effect?.question?.isFn ? effect.question() : effect?.question?.(context)

      // un exercice rend soit une simple couleur, soit un jeu de nodes PBR
      const nodes = result?.isNode ? { colorNode: result } : result ?? { colorNode: vec3(0.02, 0.02, 0.03) }

      // on remet a null ce que l'exercice precedent avait pose
      for (const slot of NODE_SLOTS) material[slot] = nodes[slot] ?? null
      material.transparent = Boolean(nodes.opacityNode)
      material.needsUpdate = true

      if (debug.children.length === 0) {
        debug.destroy()
        debug = null
      }
    }

    createExerciseSelector({ gui, registry, storageKey: STORAGE_KEY, onChange: apply })

    return {
      update({ delta }) {
        mesh.rotation.y += motion.spin * delta
      },

      dispose() {
        camera.position.z = previousCameraZ
      },
    }
  },
}
