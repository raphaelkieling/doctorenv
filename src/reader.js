import { Definition, DefinitionStatus } from './definition.js'
import chalk from 'chalk'

export async function readFile(filePath) {
  const { default: data } = await import(filePath)
  const definitions = await evaluateFromData(data)
  printDefinitions(definitions)
}

export async function evaluateFromData(data) {
  const definitions = data.map((d) => new Definition(d))

  for await (const d of definitions) {
    await d.evaluate()
  }

  return definitions
}

export function printDefinitions(definitions, depth = 0) {
  definitions.forEach((d) => {
    print(d, depth)

    if (d.definitions.length === 0) return

    d.definitions.forEach((definition) => {
      print(definition, depth + 1)
    })
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

      if (definition.suggestions?.length > 0) {
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
