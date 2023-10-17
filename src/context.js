import { exec } from 'child_process'

async function executeBashScript(payload, options = {}) {
  return new Promise(async (resolve, reject) => {
    exec(payload, (error, stdout, stderr) => {
      if (options?.debug) {
        console.log(stdout)
        console.error(stderr)
      }

      if (error) {
        reject(error)
      }

      resolve(true)
    })
  })
}

export function buildContext({ definition }) {
  const context = {
    definition,
    bash: executeBashScript,
  }

  return context
}
