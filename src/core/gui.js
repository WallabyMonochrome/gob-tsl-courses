import GUI from 'lil-gui'

export const gui = new GUI({ title: 'TSL Courses' })

export function createLessonSelector(lessons, currentId) {
  const state = { lesson: currentId }
  const options = Object.fromEntries(lessons.map((lesson) => [lesson.title, lesson.id]))

  const controller = gui
    .add(state, 'lesson', options)
    .name('Shape')
    .onChange((id) => {
      location.hash = id
    })

  return (id) => {
    state.lesson = id
    controller.updateDisplay()
  }
}

