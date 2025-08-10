import { Router } from 'express';
import { body, param } from 'express-validator';
import * as ctrl from '../controllers/tasks.controller';
import { validate } from '../middleware/validate.middleware';

const router = Router();

router.post('/',
  body('source').isString().notEmpty().withMessage('source is required'),
  validate,
  ctrl.createTask);

router.get('/:taskId',
  param('taskId').isString().isLength({ min: 10 }),
  validate,
  ctrl.getTask);

export default router;