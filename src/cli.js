import { startFile } from './reader.js'
import path from 'node:path'
import fs from 'node:fs'
import yargs from 'yargs'

export function startCli() {
  yargs(process.argv.slice(2))
    .scriptName('doctorenv')
    .command(
      'check',
      'Check the file',
      () => {},
      async (argv) => {
        const fileName = argv._[1]
        await startFile(fileName)
      }
    )
    .command(
      'init',
      'Create a default config file',
      () => {},
      async () => {
        fs.writeFileSync(
          path.resolve(process.cwd(), 'doctorenv.config.js'),
          `
module.exports = ({ builder }) => {
  return builder.task('has npm', ({ bash }) => bash\`npm --version\`).build()
}
          `.trim()
        )
      }
    )
    .demandCommand(1)
    .parse()
}
