import { $ } from 'execa'

export function buildContext({ definition }) {
  const context = {
    definition,
    bash: $,
  }

  return context
}
