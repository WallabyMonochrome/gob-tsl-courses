import { createRegistry } from '../../registry.js'

export const registry = createRegistry({
  questionModules: import.meta.glob('./questions/*.js', { eager: true }),
  solutionModules: import.meta.glob('./solutions/*.js', { eager: true }),
})
