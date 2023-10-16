import { Definition } from './definition'
import { readFromData } from './reader'

export class Builder {
  constructor() {
    this.currentDefinitionIndex = null
    this.definitions = []
  }

  get currentDefinition() {
    return this.definitions[this.currentDefinitionIndex]
  }

  createDefinition(name) {
    const definition = new Definition({ name, definitions: [] })
    this.definitions.push(definition)
    this.currentDefinitionIndex = this.definitions.length - 1
    return this
  }

  addSubDefinition(name) {
    this.currentDefinition?.definitions.push(
      new Definition({ name, definitions: [] })
    )
    return this
  }

  addSugestion(suggestion) {
    this.currentDefinition?.suggestions.push(suggestion)
    return this
  }

  addChecker(name, checker) {
    this.currentDefinition?.definitions.push(new Definition({ name, checker }))
    return this
  }

  async start() {
    return readFromData(this.definitions)
  }
}
