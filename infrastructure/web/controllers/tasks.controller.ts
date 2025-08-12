import { Request, Response } from 'express';
import createHttpError from 'http-errors';
import { TaskUseCase } from '../../../application/usecases/task.usecase';

export class TasksController {
  constructor(private readonly taskUseCase: TaskUseCase) {}

  createTask = async (req: Request, res: Response) => {
    const { source } = req.body as { source: string };
    const task = await this.taskUseCase.createTask(source);
    return res.status(201).json(task);
  };

  getTask = async (req: Request, res: Response) => {
    const { taskId } = req.params as { taskId: string };
    const task = await this.taskUseCase.getTask(taskId);
    if (!task) throw createHttpError(404, 'Task not found');

    const { taskId: id, status, price, images } = task;

    if (status === 'pending') {
      return res.json({ status, price });
    }

    if (status === 'completed') {
      return res.json({ taskId: id, status, price, images });
    }

    return res.json({ taskId: id, status, price });
  };
}
