import { cosmiconfigSync } from 'cosmiconfig'
import { startFile } from './reader.js'
import path from 'node:path'
import fs from 'node:fs'
import yargs from 'yargs'

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

yargs(process.argv.slice(2))
  .scriptName('doctorenv')
  .command(
    'check',
    'Check the file',
    () => {},
    async (argv) => {
      const fileName = argv._[1]
      await startFile(resolveName(fileName))
    }
  )
  .command(
    'init',
    'Create a default config file',
    () => {},
    async () => {
      fs.writeFileSync(
        path.resolve(process.cwd(), 'doctorenv.config.js'),
        `module.exports = ({ builder }) => { return [] }`
      )
    }
  )
  .demandCommand(1)
  .parse()
