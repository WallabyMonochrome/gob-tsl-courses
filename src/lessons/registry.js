// Registre des effets TSL d'une lecon.
//
// Chaque lecon passe ses propres globs : un fichier de `questions/` devient un
// exercice, chaque fonction qu'il exporte une variante. `questions/` fait foi —
// une solution sans question equivalente n'apparait pas. Le dossier
// `solutions/` est gitignore, son glob renvoie simplement {} sans lui.

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
    const functions = Object.entries(module).filter(([, value]) => typeof value === 'function')

    files.set(basename(path), {
      effects: new Map(functions),
      // `export const order = [...]` impose l'ordre du menu, sinon alphabetique
      order: Array.isArray(module.order) ? module.order : [],
    })
  }

  return files
}

function sortNames(names, order) {
  const rank = (name) => order.indexOf(name) + 1 || Number.MAX_SAFE_INTEGER

  return names.sort((a, b) => rank(a) - rank(b) || a.localeCompare(b))
}

export function createRegistry({ questionModules, solutionModules = {}, targetDir }) {
  const questions = collect(questionModules)
  const solutions = collect(solutionModules)

  const exercises = [...questions.keys()]
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
          target: targetDir ? `${targetDir}/${file}/${name}.png` : null,
        })),
      }
    })
    .filter((exercise) => exercise.effects.length > 0)

  const findExercise = (id) => exercises.find((item) => item.id === id) ?? exercises[0] ?? null

  const findEffect = (exerciseId, effectId) => {
    const exercise = findExercise(exerciseId)

    return exercise?.effects.find((item) => item.id === effectId) ?? exercise?.effects[0] ?? null
  }

  return { exercises, findExercise, findEffect }
}
