import { ListrEnquirerPromptAdapter } from '@listr2/prompt-adapter-enquirer'
import { Listr } from 'listr2'
import { $ } from 'execa'
import { Builder } from './builder'
import { arrayOfTasksSchema } from './validator'

function buildContext(ctx, task) {
  const newCtx = {
    ...ctx,
    task,
    bash: $,
    prompt: task.prompt(ListrEnquirerPromptAdapter).run.bind(task),
    delay: (ms) => {
      return new Promise((resolve) => {
        setTimeout(resolve, ms)
      })
    },
    checkEnv: (envName) => {
      if (!process.env[envName]) {
        throw new Error(`env ${envName} is not set`)
      }
    },
  }

  return newCtx
}

function mapper(def) {
  return {
    title: def.title,
    task: async (ctx, task) => {
      try {
        if (def.tasks?.length > 0) {
          return task.newListr(def.tasks.map(mapper), {
            concurrent: false,
            rendererOptions: { collapseSubtasks: true },
          })
        }

        await def.task(buildContext(ctx, task))
      } catch (err) {
        if (def.suggestion) throw Error(`${def.title} - (${def.suggestion})`)
        throw err
      }
    },
  }
}

export async function startFile(filePath) {
  const { default: fn } = await import(filePath)

  const data = fn({ builder: new Builder() })

  if (!data) {
    throw new Error('No data returned from config file')
  }

  const options = Array.isArray(data) ? {} : data?.options
  const definitions = Array.isArray(data) ? data : data.tasks

  const { error } = arrayOfTasksSchema.validate(definitions, {
    abortEarly: false,
  })
  if (error) throw error

  const tasksFromDefinitions = definitions.map(mapper)
  const tasks = new Listr(tasksFromDefinitions, {
    concurrent: options?.concurrent ?? false,
    exitOnError: false,
  })

  await tasks.run()

  return true
}
