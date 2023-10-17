import { buildContext } from './context'

export const DefinitionDictionary = new Map()

export const DefinitionStatus = {
  PENDING: 'PENDING',
  SUCCESS: 'SUCCESS',
  FAILED: 'FAILED',
  PARTIAL: 'PARTIAL',
}

export class Definition {
  constructor({ name, checker, suggestions, definitions }) {
    if (checker && definitions?.length > 0)
      throw new Error(
        `Definition ${name} has both checker and definitions. You cannot use in the same time.`
      )

    if (!name) throw new Error('Definition name is required')

    this.name = name
    this.checker = checker
    this.status = DefinitionStatus.PENDING
    this.suggestions = suggestions ?? []
    this.isGroup = definitions?.length > 0
    this.definitions = definitions?.map((d) => new Definition(d)) ?? []
  }

  get hasSucceed() {
    return this.status === DefinitionStatus.SUCCESS
  }

  pushSuggestion(suggestion) {
    this.suggestions.push(suggestion)
  }

  async runChecker() {
    try {
      const ctx = buildContext({ definition: this })
      return this.checker ? await this.checker(ctx) : true
    } catch (e) {
      return false
    }
  }

  async evaluate(definition = this) {
    definition.isGroup = definition?.definitions?.length > 0

    DefinitionDictionary.set(definition.name, definition)

    for (const def of definition.definitions) {
      await definition.evaluate(def)

      DefinitionDictionary.set(definition.name, definition)
    }

    if (!definition.isGroup) {
      definition.status = (await definition.runChecker())
        ? DefinitionStatus.SUCCESS
        : DefinitionStatus.FAILED
    } else {
      const statuses = definition.definitions.map((def) => def.status)
      const allFailed = statuses.every((s) => s === DefinitionStatus.FAILED)
      const hasFailed = statuses.some((s) => s === DefinitionStatus.FAILED)

      const allSuccess = statuses.every((s) => s === DefinitionStatus.SUCCESS)
      const hasSuccess = statuses.some((s) => s === DefinitionStatus.SUCCESS)

      if (allFailed && hasFailed) definition.status = DefinitionStatus.FAILED
      else if (allSuccess && hasSuccess)
        definition.status = DefinitionStatus.SUCCESS
      else definition.status = DefinitionStatus.PARTIAL
    }

    return this
  }
}
