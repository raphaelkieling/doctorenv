import { it, describe, expect, vi } from 'vitest'
import { startFile } from './reader'
import path from 'node:path'

vi.mock('listr2')
vi.mock('node-banner')

describe('startFile', () => {
  it('should throw an error if no data is returned from the config file', async () => {
    const filePath = path.resolve(__dirname, '../examples/empty.config.js')
    await expect(startFile(filePath)).rejects.toThrow(
      'No data returned from config file'
    )
  })

  it('should not throw an error for a raw mode', async () => {
    const filePath = path.resolve(__dirname, '../examples/raw.config.js')
    await expect(startFile(filePath)).resolves.toBeTruthy()
  })

  it('should not throw an error for a raw array mode', async () => {
    const filePath = path.resolve(__dirname, '../examples/rawarray.config.js')
    await expect(startFile(filePath)).resolves.toBeTruthy()
  })

  it('should not throw an error for a builder mode', async () => {
    const filePath = path.resolve(__dirname, '../examples/builder.config.js')
    await expect(startFile(filePath)).resolves.toBeTruthy()
  })

  it('should throw an error for an invalid schema', async () => {
    const filePath = path.resolve(__dirname, '../examples/notvalid.config.js')
    await expect(startFile(filePath)).rejects.toThrowError(
      '"[0].title" is required. "[0].tasks[0].title" is required. "[0].tasks[0].titles" is not allowed. "[0].titles" is not allowed'
    )
  })
})
