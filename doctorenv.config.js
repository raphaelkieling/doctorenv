module.exports = () => [
  {
    title: 'Check npm',
    task: ({ bash }) => bash('npm --version'),
  },
  {
    title: 'Check github write access',
    task: ({ bash }) => bash('git push -u --dry-run'),
  },
]
