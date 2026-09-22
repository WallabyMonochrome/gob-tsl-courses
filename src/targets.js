// Outil prof : rend chaque solution en PNG et l'envoie dans public/targets/.
// Les etudiants n'ont pas le dossier solutions/, cette page ne trouve alors
// rien a rendre — c'est ce qui permet de livrer les images sans le code.
//
//   npm run targets

import {
  Mesh,
  MeshBasicNodeMaterial,
  OrthographicCamera,
  PlaneGeometry,
  Scene,
  WebGPURenderer,
} from 'three/webgpu'

const SOLUTIONS = import.meta.glob('./lessons/*/tsl/solutions/*.js', { eager: true })

const SIZE = 512

const log = document.querySelector('#log')
const print = (line, className = '') => {
  log.insertAdjacentHTML('beforeend', `<div class="${className}">${line}</div>`)
}

const basename = (path) => path.split('/').pop().replace(/\.js$/, '')

const targets = Object.entries(SOLUTIONS).flatMap(([path, module]) =>
  Object.entries(module)
    .filter(([, value]) => typeof value === 'function')
    .map(([name, build]) => ({ file: `${basename(path)}/${name}.png`, build })),
)

log.textContent = ''

if (targets.length === 0) {
  print('Aucune solution trouvee — rien a rendre.', 'miss')
} else {
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = SIZE

  const renderer = new WebGPURenderer({ canvas, antialias: true })
  renderer.setSize(SIZE, SIZE, false)
  await renderer.init()

  const camera = new OrthographicCamera(-1, 1, 1, -1, 0, 10)
  camera.position.z = 1

  const material = new MeshBasicNodeMaterial()
  const scene = new Scene()
  scene.add(new Mesh(new PlaneGeometry(2, 2), material))

  for (const { file, build } of targets) {
    try {
      material.colorNode = build()
      material.needsUpdate = true
      await renderer.renderAsync(scene, camera)

      const data = canvas.toDataURL('image/png').split(',')[1]

      const response = await fetch('/__targets', {
        method: 'POST',
        body: JSON.stringify({ file, data }),
      })

      if (!response.ok) throw new Error(await response.text())

      print(`ok   ${file}`)
    } catch (error) {
      print(`fail ${file} — ${error.message}`, 'fail')
    }
  }

  print(`\n${targets.length} cible(s) ecrite(s) dans public/targets/.`)
}
