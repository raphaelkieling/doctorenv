import { cosmiconfigSync } from 'cosmiconfig'
import { readFile } from './reader.js'
import path from 'node:path'
import fs from 'node:fs'
import yargs from 'yargs'

yargs(process.argv.slice(2))
  .scriptName('doctorenv')
  .command(
    'check',
    'Check the file',
    () => {},
    async (argv) => {
      const fileName = argv._[1]
      const pwd = process.cwd()
      const customFilePath = path.resolve(pwd, fileName)

      const explorerSync = cosmiconfigSync('doctorenv', { stopDir: pwd })
      const searchedFor = explorerSync.search()

      if (fileName && !fs.existsSync(customFilePath)) {
        console.error('Custom configuration not found')
        return process.exit(1)
      }

      if (!searchedFor?.filepath) {
        console.error('No configuration file found')
        return process.exit(1)
      }

      await readFile(fileName ? customFilePath : searchedFor.filepath)
    }
  )
  .demandCommand(1)
  .parse()
