/**
 * @param {object} params - config params
 * @param {import("../src/index").Builder} params.builder - the builder instance
 */
module.exports = ({ builder }) => {
  return builder
    .task('has npm', ({ bash }) => bash`npm --version`)
    .task('has yarn', ({ bash }) => bash`yarn --version`)
    .task('has env', ({ checkEnv }) => checkEnv('TERM'))
    .task('skipped task', ({ task }) => task.skip('i want to skip this task'))
    .task('main task')
    .setFixableSuggestion('Run source ./env1.sh', ({ bash }) => bash`cat ./bin`)
    .subTask('child 1', ({ task }) => task.skip('just the child 1'))
    .subTask('child 2', ({ delay }) => delay(3000))
    .subTask('child 3', ({ task }) => task.skip('just the child 3'))
    .setSuggestion('Run source ./env.sh')
    .subTask('child 4', ({ checkEnv }) => checkEnv('XX'))
    .subTask('child 5', ({ checkEnv }) => checkEnv('XX'))
    .setFixableSuggestion('Run source ./env.sh', ({ bash }) => bash`cat ./bin`)
    .task('delayed for 2s', async ({ delay }) => delay(2000))
    .setConcurrent()
    .build()
}
