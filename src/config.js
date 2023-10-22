import { cosmiconfigSync } from 'cosmiconfig'
import { Builder } from './builder'
import path from 'node:path'
import fs from 'node:fs'

function resolveName(customName) {
  const pwd = process.cwd()

  if (customName) {
    const customFilePath = path.resolve(pwd, customName)

    if (!fs.existsSync(customFilePath)) {
      console.error('Custom configuration not found')
      return process.exit(1)
    }

    return customFilePath
  }

  const explorerSync = cosmiconfigSync('doctorenv', { stopDir: pwd })
  const searchedFor = explorerSync.search()

  if (!searchedFor?.filepath) {
    console.error('No configuration file found')
    return process.exit(1)
  }

  return searchedFor.filepath
}

export async function importConfigData(fileName) {
  const { default: imported } = await import(resolveName(fileName))

  // Build the tasks
  const data =
    typeof imported === 'function'
      ? imported({ builder: new Builder() })
      : imported

  if (!data) {
    throw new Error('No data returned from config file')
  }

  return data
}
