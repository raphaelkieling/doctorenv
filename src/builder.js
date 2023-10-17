export class Builder {
  constructor() {
    this._currentTask = null
    this._tasks = []
    this._options = {}
  }

  get currentDefinition() {
    return this._currentTask
  }

  setConcurrent(active = true) {
    this._options.concurrent = active
    return this
  }

  task(title, task) {
    const definition = { title, task, tasks: [] }
    this._tasks.push(definition)
    this._currentTask = definition
    return this
  }

  subTask(title, task) {
    this._currentTask?.tasks.push({ title, task })
    return this
  }

  build() {
    return {
      options: this._options,
      tasks: this._tasks,
    }
  }
}
