import { ListrEnquirerPromptAdapter } from '@listr2/prompt-adapter-enquirer'
import { Listr } from 'listr2'
import { $ } from 'execa'
import { Builder } from './builder'

function buildContext(ctx, task) {
  ctx.task = task
  ctx.bash = $
  ctx.prompt = task.prompt(ListrEnquirerPromptAdapter).run.bind(task)
  ctx.delay = (ms) => {
    return new Promise((resolve) => {
      setTimeout(resolve, ms)
    })
  }
  ctx.checkEnv = (envName) => {
    if (!process.env[envName]) {
      throw new Error(`env ${envName} is not set`)
    }
  }

  return ctx
}

function mapper(def) {
  return {
    title: def.title,
    task: async (ctx, task) => {
      if (def.tasks?.length > 0) {
        return task.newListr(def.tasks.map(mapper), {
          concurrent: false,
          rendererOptions: { collapseSubtasks: true },
        })
      }

      await def.task(buildContext(ctx, task))
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
  const tasksFromDefinitions = definitions.map(mapper)

  const tasks = new Listr(tasksFromDefinitions, {
    concurrent: options?.concurrent ?? false,
    exitOnError: false,
  })

  await tasks.run()
}
