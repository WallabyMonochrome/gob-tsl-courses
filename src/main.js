import './style.css'
import { Sketch } from './core/Sketch.js'
import { createLessonSelector } from './core/gui.js'
import { lessons } from './lessons/index.js'

const sketch = new Sketch(document.querySelector('#webgpu'))
await sketch.init()

const current = () => lessons.find((lesson) => lesson.id === location.hash.slice(1)) ?? lessons[0]

const syncSelector = createLessonSelector(lessons, current().id)

async function route() {
  const lesson = current()

  syncSelector(lesson.id)
  await sketch.load(lesson)
}

window.addEventListener('hashchange', route)
await route()
