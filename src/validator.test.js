import { describe, it, expect } from 'vitest'
import { taskSchema } from './validator.js'

describe('taskSchema', () => {
  it('should validate a valid task object', () => {
    const validTask = {
      title: 'My Task',
      task: () => {},
      tasks: [
        {
          title: 'Subtask 1',
          task: () => {},
          tasks: [
            {
              title: 'Subtask 1.1',
              task: () => {},
            },
          ],
        },
      ],
    }

    const { error } = taskSchema.validate(validTask)
    expect(error).toBe(undefined)
  })

  it('should not validate an invalid task object', () => {
    const invalidTask = {
      title: 'My Task',
      task: () => {},
      tasks: [
        {
          title: 'Subtask 1',
          task: () => {},
          tasks: [
            {
              title: 'Subtask 1.1',
              task: 'not a function',
            },
          ],
        },
      ],
    }

    const { error } = taskSchema.validate(invalidTask)
    expect(error).not.toBe(undefined)
  })
})
