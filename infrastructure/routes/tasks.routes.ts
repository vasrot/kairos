import { Router } from 'express';
import { body, param } from 'express-validator';
import { validate } from '../middleware/validate.middleware';
import { TasksController } from '../web/controllers/tasks.controller';

export default function createTasksRouter(controller: TasksController): Router {
  const router = Router();

  router.post('/',
    body('source').isString().notEmpty().withMessage('source is required'),
    validate,
    controller.createTask);

  router.get('/:taskId',
    param('taskId').isString(),
    validate,
    controller.getTask);

  return router;
}