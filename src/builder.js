export class Builder {
  #currentSubTask
  #tasks
  #options

  constructor() {
    this._currentTask = null
    this.#currentSubTask = null
    this.#tasks = []
    this.#options = {}
  }

  setConcurrent(active = true) {
    this.#options.concurrent = active
    return this
  }

  task(title, task) {
    const definition = { title, task, tasks: [] }
    this.#tasks.push(definition)
    this.#currentSubTask = null
    this._currentTask = definition
    return this
  }

  setSuggestion(suggestion) {
    ;(this.#currentSubTask ?? this._currentTask).suggestion = suggestion
    return this
  }

  setFixableSuggestion(title, task) {
    ;(this.#currentSubTask ?? this._currentTask).fix = { title, task }
    return this
  }

  subTask(title, task) {
    const definition = { title, task }
    this.#currentSubTask = definition
    this._currentTask?.tasks.push(definition)
    return this
  }

  build() {
    return {
      options: this.#options,
      tasks: this.#tasks,
    }
  }
}
