import { Mesh, MeshStandardNodeMaterial, SphereGeometry, DirectionalLight, AmbientLight } from 'three/webgpu'
import { vec3 } from 'three/tsl'

import { createExerciseSelector } from '../exercise-selector.js'
import { registry } from './tsl/index.js'

const STORAGE_KEY = '02-primitive:selection'

const NODE_SLOTS = ['positionNode', 'colorNode', 'normalNode', 'aoNode', 'roughnessNode', 'metalnessNode']

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

    const apply = (state) => {
      const effect = registry.findEffect(state.exercise, state.effect)

      const result = effect?.question ? effect.question() : vec3(0.02, 0.02, 0.03)

      // un exercice rend soit une simple couleur, soit un jeu de nodes PBR
      const nodes = result?.isNode ? { colorNode: result } : result

      // on remet a null ce que l'exercice precedent avait pose
      for (const slot of NODE_SLOTS) material[slot] = nodes[slot] ?? null
      material.needsUpdate = true
    }

    createExerciseSelector({ gui, registry, storageKey: STORAGE_KEY, onChange: apply })

    return {
      update({ delta }) {
        //mesh.rotation.y += delta * 0.3
      },

      dispose() {
        camera.position.z = previousCameraZ
      },
    }
  },
}
