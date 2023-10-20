module.exports = () => {
  return [
    {
      title: 'NPM or YARN',
      task: async ({ bash }) => {
        await bash`npm --version`
        await bash`yarn --version`
      },
    },
    {
      title: 'has docker',
      task: async ({ bash }) => {
        await bash`docker --version`
      },
    },
    {
      title: 'has containerd',
      tasks: [
        {
          title: 'child',
          task: async ({ checkEnv }) => {
            return checkEnv('XX')
          },
        },
      ],
    },
  ]
}
