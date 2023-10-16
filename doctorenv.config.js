module.exports = [
  {
    name: 'Check npm',
    checker: ({ bash }) => bash('npm --version'),
  },
  {
    name: 'Check github write access',
    checker: ({ bash }) => bash('git push -u --dry-run'),
  },
]
