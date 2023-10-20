export class Builder {
  constructor() {
    this._currentTask = null
    this._currentSubTask = null
    this._tasks = []
    this._options = {}
  }

  setConcurrent(active = true) {
    this._options.concurrent = active
    return this
  }

  task(title, task) {
    const definition = { title, task, tasks: [] }
    this._tasks.push(definition)
    this._currentSubTask = null
    this._currentTask = definition
    return this
  }

  setSuggestion(suggestion) {
    ;(this._currentSubTask ?? this._currentTask).suggestion = suggestion
    return this
  }

  setFixableSuggestion(title, task) {
    ;(this._currentSubTask ?? this._currentTask).fix = { title, task }
    return this
  }

  subTask(title, task) {
    const definition = { title, task }
    this._currentSubTask = definition
    this._currentTask?.tasks.push(definition)
    return this
  }

  build() {
    return {
      options: this._options,
      tasks: this._tasks,
    }
  }
}
