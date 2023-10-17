import Joi from 'joi'

export const taskSchema = Joi.object({
  title: Joi.string().required(),
  task: Joi.function(),
  tasks: Joi.array().items(Joi.link('#task')),
}).id('task')

export const arrayOfTasksSchema = Joi.array()
  .items(taskSchema)
  .id('arrayOfTasks')
