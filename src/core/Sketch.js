import {
  AmbientLight,
  Clock,
  Group,
  PerspectiveCamera,
  Scene,
  WebGPURenderer,
} from 'three/webgpu'
import { gui } from './gui.js'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { Mesh, MeshBasicNodeMaterial, PlaneGeometry } from 'three/webgpu'
import { color, uv, vec2 } from 'three/tsl'

export class Sketch {
  constructor(canvas) {
    this.canvas = canvas
    this.clock = new Clock()

    this.scene = new Scene()

    this.camera = new PerspectiveCamera(50, 1, 0.1, 100)
    this.camera.position.set(0, 0, 3)

    this.background = '#111418'
    this.renderer = new WebGPURenderer({ canvas, antialias: true })
    this.renderer.setClearColor(this.background)

    this.controls = new OrbitControls(this.camera, canvas)
    this.controls.enableDamping = true

    this.lesson = null
    this.instance = null
    this.folder = null

    this.render = this.render.bind(this)
    this.resize = this.resize.bind(this)
  }


  async init() {
    await this.renderer.init()
    this.resize()
    window.addEventListener('resize', this.resize)
    this.renderer.setAnimationLoop(this.render)
  }

  async load(lesson) {
    this.unload()

    const group = new Group()
    group.name = lesson.id
    this.scene.add(group)

    const folder = gui.addFolder(lesson.title)

    this.lesson = lesson
    this.instance = (await lesson.setup({
      group,
      gui: folder,
      scene: this.scene,
      camera: this.camera,
      controls: this.controls,
      renderer: this.renderer,
    })) ?? {}

    if (folder.children.length === 0) folder.destroy()
    else this.folder = folder
  }

  unload() {
    if (!this.lesson) return

    this.instance.dispose?.()
    this.folder?.destroy()

    const group = this.scene.getObjectByName(this.lesson.id)
    group?.traverse((child) => {
      child.geometry?.dispose()
      child.material?.dispose()
    })
    if (group) this.scene.remove(group)

    this.lesson = null
    this.instance = null
    this.folder = null
  }


  resize() {
    const { clientWidth: width, clientHeight: height } = this.canvas

    this.camera.aspect = width / height
    this.camera.updateProjectionMatrix()

    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    this.renderer.setSize(width, height, false)
  }

  render() {
    const delta = this.clock.getDelta()
    const elapsed = this.clock.elapsedTime

    this.controls.update()
    this.instance?.update?.({ delta, elapsed })
    this.renderer.render(this.scene, this.camera)
  }
}
