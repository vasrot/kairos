import { Request, Response } from 'express';
import { createTask as createTaskSvc } from '../services/task.service.js';

export async function createTask(req: Request, res: Response) {
  const { source } = req.body as { source: string };
  const task = await createTaskSvc(source);
  return res.status(201).json({ taskId: task._id, status: task.status, price: task.price });
}