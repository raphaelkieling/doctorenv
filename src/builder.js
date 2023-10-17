import { Definition } from './definition'
import { evaluateFromData, printDefinitions } from './reader'

export class Builder {
  constructor({ printer = printDefinitions } = {}) {
    this._currentDefinition = null
    this._currentChecker = null
    this._printer = printer
    this.definitions = []
  }

  get currentDefinition() {
    return this._currentDefinition
  }

  createDefinition(name) {
    const definition = new Definition({ name, definitions: [] })
    this.definitions.push(definition)
    this._currentDefinition = definition
    return this
  }

  addSugestion(suggestion) {
    if (this._currentChecker) {
      this._currentChecker?.suggestions.push(suggestion)
      return this
    }

    this._currentDefinition?.suggestions.push(suggestion)
    return this
  }

  addChecker(name, checker) {
    const definition = new Definition({ name, checker })
    this._currentDefinition?.definitions.push(definition)
    this._currentChecker = definition
    return this
  }

  async getSimpleTree() {
    const converter = (_, val) => {
      if (typeof val === 'function' || (val && val.constructor === RegExp)) {
        return String(val)
      }
      return val
    }

    return JSON.parse(
      JSON.stringify(await evaluateFromData(this.definitions), converter, 2)
    )
  }

  async run() {
    const def = await evaluateFromData(this.definitions)
    this._printer(def)
    return def
  }
}
