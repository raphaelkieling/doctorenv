module.exports = ({ builder }) => {
  return builder
    .task('has npm', ({ bash }) => bash`npm --version`)
    .task('has yarn', ({ bash }) => bash`yarn --version`)
    .task('has env', ({ checkEnv }) => checkEnv('TERM'))
    .task('skipped task', ({ task }) => task.skip('i want to skip this task'))
    .task('main task')
    .subTask('child 1', ({ task }) => task.skip('just the child 1'))
    .subTask('child 2', ({ delay }) => delay(3000))
    .subTask('child 3', ({ task }) => task.skip('just the child 3'))
    .subTask('child 4', ({ checkEnv }) => checkEnv('XX'))
    .setSuggestion('Run source ./env.sh')
    .task('delayed for 2s', async ({ delay }) => delay(2000))
    .setConcurrent()
    .build()
}
