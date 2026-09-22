import {
  Mesh,
  MeshBasicNodeMaterial,
  PlaneGeometry,
  SRGBColorSpace,
  TextureLoader,
  Vector3,
} from 'three/webgpu'
import { Fn, mix, texture, uv, vec3 } from 'three/tsl'

import { createExerciseSelector } from '../exercise-selector.js'
import { registry } from './tsl/index.js'

const STORAGE_KEY = '01-plane:selection'

const PLANE_SIZE = 1.8
const GAP = 0.25
const OFFSET = (PLANE_SIZE + GAP) / 2
const CAMERA_DISTANCE = 4.4

const loader = new TextureLoader()
const textures = new Map()

// hachures : affichees quand l'image de reference n'a pas encore ete rendue
const missingTarget = Fn(() => {
  const stripes = uv().x.add(uv().y).mul(24).fract().step(0.5)

  return mix(vec3(0.09, 0.1, 0.12), vec3(0.14, 0.15, 0.18), stripes)
})

function loadTarget(url, onMissing) {
  if (!textures.has(url)) {
    const map = loader.load(url, undefined, undefined, () => {
      textures.set(url, null)
      onMissing()
    })
    map.colorSpace = SRGBColorSpace

    textures.set(url, map)
  }

  return textures.get(url)
}

function createLabel(text) {
  const element = document.createElement('div')
  element.className = 'plane-label'
  element.textContent = text
  document.body.appendChild(element)

  return element
}

export default {
  id: '01-plane',
  title: '01 — Plane',

  setup({ group, gui, camera }) {
    const geometry = new PlaneGeometry(PLANE_SIZE, PLANE_SIZE)

    const targetMaterial = new MeshBasicNodeMaterial()
    const studentMaterial = new MeshBasicNodeMaterial()

    const target = new Mesh(geometry, targetMaterial)
    target.position.x = -OFFSET

    const student = new Mesh(geometry, studentMaterial)
    student.position.x = OFFSET

    group.add(target, student)

    const previousCameraZ = camera.position.z
    camera.position.set(0, 0, CAMERA_DISTANCE)

    const labels = [
      { element: createLabel('Target'), mesh: target },
      { element: createLabel('Your code'), mesh: student },
    ]

    const apply = (state) => {
      const effect = registry.findEffect(state.exercise, state.effect)

      studentMaterial.colorNode = effect?.question ? effect.question() : missingTarget()
      studentMaterial.needsUpdate = true

      // en local le prof a les solutions : on rend la vraie, pas l'image
      if (effect?.solution) {
        targetMaterial.colorNode = effect.solution()
      } else {
        const map = effect ? loadTarget(effect.target, () => apply(state)) : null
        targetMaterial.colorNode = map ? texture(map) : missingTarget()
      }
      targetMaterial.needsUpdate = true
    }

    createExerciseSelector({ gui, registry, storageKey: STORAGE_KEY, onChange: apply })

    const position = new Vector3()

    return {
      update() {
        for (const { element, mesh } of labels) {
          position.set(mesh.position.x, -PLANE_SIZE / 2 - 0.15, 0).project(camera)

          element.style.left = `${(position.x * 0.5 + 0.5) * window.innerWidth}px`
          element.style.top = `${(position.y * -0.5 + 0.5) * window.innerHeight}px`
        }
      },

      dispose() {
        for (const { element } of labels) element.remove()
        camera.position.z = previousCameraZ
      },
    }
  },
}
