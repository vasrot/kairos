import { Request, Response } from 'express';
import createHttpError from 'http-errors';
import { createTask as createTaskSvc, getTask as getTaskSvc } from '../services/task.service.js';

export async function createTask(req: Request, res: Response) {
  const { source } = req.body as { source: string };
  const task = await createTaskSvc(source);
  return res.status(201).json({ taskId: task._id, status: task.status, price: task.price });
}

export async function getTask(req: Request, res: Response) {
  const { taskId } = req.params;
  const task = await getTaskSvc(taskId);
  if (!task) throw createHttpError(404, 'Task not found');
  const { _id, status, price, images, originalPath } = task;
  const filteredImages = images.map(({ resolution, path }) => ({ resolution, path }));
  return res.json({ taskId: _id, status, price, images: status === 'completed' ? filteredImages : undefined, originalPath });
}