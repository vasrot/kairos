import { Request, Response } from 'express';
import createHttpError from 'http-errors';
import { TaskUseCase } from '../usecases/task.usecase';
import { TaskAdapter } from '../../infrastructure/adapters/task.adapter';

const taskUseCase = new TaskUseCase(new TaskAdapter());

export async function createTask(req: Request, res: Response) {
  const { source } = req.body as { source: string };
  const task = await taskUseCase.createTask(source);
  return res.status(201).json(task);
}

export async function getTask(req: Request, res: Response) {
  const { taskId } = req.params;
  const task = await taskUseCase.getTask(taskId);
  if (!task) throw createHttpError(404, 'Task not found');

  const { taskId: id, status, price, images } = task;

  if (status === 'pending') {
    return res.json({ status, price });
  }

  if (status === 'completed') {
    return res.json({ taskId: id, status, price, images });
  }

  return res.json({ taskId: id, status, price });
}