import { readFile } from './reader.js'
import path from 'node:path'
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
      await readFile(path.resolve(pwd, fileName ?? 'doctorenv.config.js'))
    }
  )
  .demandCommand(1)
  .parse()
