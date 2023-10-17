import { describe, it, expect, vi } from 'vitest'
import { Builder } from './builder.js'

describe('Builder', () => {
  it('should create definitions with checkers', async () => {
    const builder = new Builder({ printer: vi.fn() })

    await builder
      .createDefinition('Definition 1')
      .addSugestion('try another thing')
      .addChecker('has yarn', () => true)
      .addSugestion('install yarn')
      .addChecker('has npm', () => true)
      .createDefinition('Definition 2')
      .addChecker('has docker', () => true)
      .addChecker('has docker-compose', () => true)
      .addSugestion('install docker-compose')
      .run()

    expect(await builder.getSimpleTree()).toEqual([
      {
        definitions: [
          {
            checker: '() => true',
            definitions: [],
            isGroup: false,
            name: 'has yarn',
            status: 'SUCCESS',
            suggestions: ['install yarn'],
          },
          {
            checker: '() => true',
            definitions: [],
            isGroup: false,
            name: 'has npm',
            status: 'SUCCESS',
            suggestions: [],
          },
        ],
        isGroup: true,
        name: 'Definition 1',
        status: 'SUCCESS',
        suggestions: ['try another thing'],
      },
      {
        definitions: [
          {
            checker: '() => true',
            definitions: [],
            isGroup: false,
            name: 'has docker',
            status: 'SUCCESS',
            suggestions: [],
          },
          {
            checker: '() => true',
            definitions: [],
            isGroup: false,
            name: 'has docker-compose',
            status: 'SUCCESS',
            suggestions: ['install docker-compose'],
          },
        ],
        isGroup: true,
        name: 'Definition 2',
        status: 'SUCCESS',
        suggestions: [],
      },
    ])
  })
})
