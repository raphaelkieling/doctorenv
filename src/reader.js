import { Definition, DefinitionStatus } from './definition.js'
import chalk from 'chalk'

export async function readFile(filePath) {
  const { default: data } = await import(filePath)
  await readFromData(data)
}

export async function readFromData(data) {
  const definitions = data.map((d) => new Definition(d))

  for await (const d of definitions) {
    await d.evaluate()
  }

  for await (const d of definitions) {
    printDefinitions(d)
  }
}

function printDefinitions(definition, depth = 0) {
  print(definition, depth)

  if (definition.definitions.length === 0) return

  definition.definitions.forEach((definition) => {
    print(definition, depth + 1)
  })
}

function print(definition, depth) {
  const tab = '\t'.repeat(depth)
  if (!definition.isGroup) {
    if (definition.status === DefinitionStatus.SUCCESS) {
      // The definition is finalized
      console.log(`${tab}${chalk.gray(`• ${definition.name}`)}`)
    } else {
      console.log(`${tab}${chalk.red.bold(`✗ ${definition.name}`)}`)

      if (definition.suggestions.length > 0) {
        definition.suggestions.forEach((s) => {
          console.log(`${tab}  ${chalk.blue(`\u2197\uFE0F ${s}`)}`)
        })
      }
    }
  } else {
    const groupped = definition.isGroup ? '❯' : ''
    const color = definition.hasSucceed ? 'gray' : 'red'
    console.log(chalk[color](`${groupped} ${tab}${definition.name}`))
  }
}
