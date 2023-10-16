module.exports = [
  {
    name: 'NPM or YARN',
    suggestions: ['install yarn or npm'],
    checker: async ({ bash }) => {
      await bash('npm --version')
      await bash('yarn --version')

      return true
    },
  },
  {
    name: 'Docker',
    suggestions: [
      {
        description: 'Install docker',
        fix: async ({ bash }) => {
          await bash('curl -fsSL https://get.docker.com -o get-docker.sh')
          await bash('sh get-docker.sh')
        },
      },
      'Install yarn',
    ],
    definitions: [
      {
        name: 'has docker',
        suggestions: ['visit: https://www.docker.com'],
        checker: ({ definition }) => {
          definition.pushSuggestion('Install docker friend')
          return false
        },
      },
      {
        name: 'has containerd',
        suggestions: ['Install the containerd'],
        checker: () => false,
      },
    ],
  },
  {
    name: 'Environments',
    definitions: [
      {
        name: 'has A',
        suggestions: ['Run the .source'],
        checker: () => !!process.env.A,
      },
      {
        name: 'has B',
        suggestions: ['Run the .source'],
        checker: () => true,
      },
    ],
  },
]
