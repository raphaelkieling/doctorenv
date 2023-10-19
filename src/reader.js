import { Listr } from 'listr2'
import { $ } from 'execa'
import { Builder } from './builder'
import { arrayOfTasksSchema } from './validator'
import { confirm } from '@inquirer/prompts'

function buildContext(ctx, task) {
  const newCtx = {
    ...ctx,
    task,
    bash: $,
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
    // Necessary to create to access the fixers in the task.errors
    metadata: def,
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

  // Build the tasks
  const data = fn({ builder: new Builder() })

  if (!data) {
    throw new Error('No data returned from config file')
  }

  const options = Array.isArray(data) ? {} : data?.options
  const definitions = Array.isArray(data) ? data : data.tasks

  // Validate the custom tasks and schemas
  const { error } = arrayOfTasksSchema.validate(definitions, {
    abortEarly: false,
  })
  if (error) throw error

  // Map for the Listr
  const tasksFromDefinitions = definitions.map(mapper)
  const tasks = new Listr(tasksFromDefinitions, {
    concurrent: options?.concurrent ?? false,
    collectErrors: 'minimal',
    exitOnError: false,
  })

  // Run it
  await tasks.run()

  // Fix the fixable tasks if the user wants to
  let runFix = false
  for (const err of tasks.errors) {
    const task = err.task.task
    const fixTask = task.metadata.fix
    if (fixTask) {
      console.log(`\n(${task.title}) is fixable:`)

      const answer = await confirm({ message: fixTask.title })
      if (answer) {
        if (!runFix) runFix = true
        await task.metadata.fix.task(buildContext({}, task))
      }
    }
  }

  if (runFix) {
    const answer = await confirm({
      message: 'Do you want to run the config again?',
    })
    if (answer) await tasks.run()
  }

  return true
}
