import { describe, it, expect, beforeEach } from 'vitest'
import { Builder } from './builder'
import { arrayOfTasksSchema } from './validator'

describe('Builder', () => {
  let builder

  beforeEach(() => {
    builder = new Builder()
  })

  describe('task', () => {
    it('adds a task definition to the list of tasks', () => {
      builder.task('Task 1', () => {})
      builder.task('Task 2', () => {})

      const { tasks } = builder.build()

      expect(tasks).toHaveLength(2)
      expect(tasks[0].title).toBe('Task 1')
      expect(tasks[1].title).toBe('Task 2')
    })

    it('should be validated using the schema using the builder', () => {
      builder.task('Task 1', () => {})
      builder.task('Task 2', () => {})

      const { tasks } = builder.build()
      const { error } = arrayOfTasksSchema.validate(tasks)
      expect(error).toBe(undefined)
    })
  })

  describe('subTask', () => {
    it('sets the current task to the newly added task definition', () => {
      builder.task('Task 1', () => {})
      builder.subTask('Subtask 1', () => {})
      builder.task('Task 2', () => {})

      const { tasks } = builder.build()

      expect(tasks[0].title).toBe('Task 1')
      expect(tasks[0].tasks).toHaveLength(1)
      expect(tasks[0].tasks[0].title).toBe('Subtask 1')

      expect(tasks[1].title).toBe('Task 2')
      expect(tasks[1].tasks).toHaveLength(0)
    })

    it('adds a subtask definition to the current task', () => {
      builder.task('Task 1', () => {})
      builder.subTask('Subtask 1', () => {})
      builder.subTask('Subtask 2', () => {})

      const { tasks } = builder.build()

      expect(tasks[0].tasks).toHaveLength(2)
      expect(tasks[0].tasks[0].title).toBe('Subtask 1')
      expect(tasks[0].tasks[1].title).toBe('Subtask 2')
    })

    it('does not add a subtask definition if there is no current task', () => {
      builder.subTask('Subtask 1', () => {})

      const { tasks } = builder.build()

      expect(tasks).toHaveLength(0)
    })
  })

  describe('setConcurrent', () => {
    it('sets the concurrent option to true', () => {
      builder.setConcurrent()

      const { options } = builder.build()

      expect(options.concurrent).toBe(true)
    })

    it('sets the concurrent option to false', () => {
      builder.setConcurrent(false)

      const { options } = builder.build()

      expect(options.concurrent).toBe(false)
    })
  })
})
