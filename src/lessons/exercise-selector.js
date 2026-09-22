// Les deux listes `Exercise` / `Effect` du panneau, plus la persistance de la
// selection. Partage par les lecons qui ont un dossier `questions/`.

export function createExerciseSelector({ gui, registry, storageKey, onChange }) {
  const { exercises, findExercise } = registry

  // la selection survit au reload declenche par Vite a chaque sauvegarde
  const saved = JSON.parse(localStorage.getItem(storageKey) ?? '{}')
  const initial = findExercise(saved.exercise)

  const state = {
    exercise: initial?.id ?? null,
    effect: initial?.effects.some((effect) => effect.id === saved.effect)
      ? saved.effect
      : initial?.effects[0]?.id ?? null,
  }

  const apply = () => {
    localStorage.setItem(storageKey, JSON.stringify(state))
    onChange(state)
  }

  const effectOptionsOf = (exercise) =>
    Object.fromEntries((exercise?.effects ?? []).map((effect) => [effect.id, effect.id]))

  gui
    .add(state, 'exercise', Object.fromEntries(exercises.map((item) => [item.label, item.id])))
    .name('Exercise')
    .onChange(() => {
      const exercise = findExercise(state.exercise)

      state.effect = exercise?.effects[0]?.id ?? null
      // options() remplace la liste sur place, le controller garde sa position
      effectController.options(effectOptionsOf(exercise))

      apply()
    })

  const effectController = gui
    .add(state, 'effect', effectOptionsOf(findExercise(state.exercise)))
    .name('Effect')
    .onChange(apply)

  apply()

  return state
}
