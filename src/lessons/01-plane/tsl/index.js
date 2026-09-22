// Registre des effets TSL de la lecon.
//
// Tout fichier depose dans `questions/` (ou `solutions/`) est ramasse
// automatiquement : le fichier devient un exercice, chaque fonction exportee
// une variante. Le dossier `solutions/` est gitignore, le glob renvoie
// simplement {} sans lui.

const QUESTION_MODULES = import.meta.glob('./questions/*.js', { eager: true })
const SOLUTION_MODULES = import.meta.glob('./solutions/*.js', { eager: true })

const basename = (path) => path.split('/').pop().replace(/\.js$/, '')

// '01-gradient-lab' → '01 — Gradient Lab'
function exerciseLabel(file) {
  const [number, ...words] = file.split('-')
  const title = words.map((word) => word[0].toUpperCase() + word.slice(1)).join(' ')

  return `${number} — ${title}`
}

function collect(modules) {
  const files = new Map()

  for (const [path, module] of Object.entries(modules)) {
    const file = basename(path)
    const functions = Object.entries(module).filter(([, value]) => typeof value === 'function')

    files.set(file, {
      effects: new Map(functions),
      // `export const order = [...]` impose l'ordre du menu, sinon alphabetique
      order: Array.isArray(module.order) ? module.order : [],
    })
  }

  return files
}

function sortNames(names, order) {
  const rank = (name) => (order.indexOf(name) + 1 || Number.MAX_SAFE_INTEGER)

  return names.sort((a, b) => rank(a) - rank(b) || a.localeCompare(b))
}

const questions = collect(QUESTION_MODULES)
const solutions = collect(SOLUTION_MODULES)

// `questions/` fait foi : une solution sans question equivalente n'apparait pas.
export const exercises = [...questions.keys()]
  .sort()
  .map((file) => {
    const { effects, order } = questions.get(file)
    const solution = solutions.get(file)

    const names = sortNames([...effects.keys()], order.length ? order : solution?.order ?? [])

    return {
      id: file,
      label: exerciseLabel(file),
      effects: names.map((name) => ({
        id: name,
        question: effects.get(name),
        solution: solution?.effects.get(name) ?? null,
        // image de reference, rendue par `npm run targets`
        target: `/targets/${file}/${name}.png`,
      })),
    }
  })
  .filter((exercise) => exercise.effects.length > 0)

export function findExercise(id) {
  return exercises.find((exercise) => exercise.id === id) ?? exercises[0] ?? null
}

export function findEffect(exerciseId, effectId) {
  const exercise = findExercise(exerciseId)

  return exercise?.effects.find((item) => item.id === effectId) ?? exercise?.effects[0] ?? null
}
