import { describe, it, expect } from 'vitest'
import { buildContext } from '../src/context.js'

describe('buildContext', () => {
  const definition = { name: 'DoctorEnv' }
  const context = buildContext({ definition })

  it('should return an object with the correct properties', () => {
    expect(context).toBeDefined()
    expect(context.definition).toBe(definition)
    expect(context.bash).toBeDefined()
    expect(typeof context.bash).toBe('function')
  })

  it('should execute a bash script and resolve with true', async () => {
    const result = await context.bash('echo "Hello, World!"')
    expect(result).toBe(true)
  })

  it('should reject with an error if the script fails', async () => {
    await expect(context.bash('exit 1')).rejects.toThrow()
  })
})
