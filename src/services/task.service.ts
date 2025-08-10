import { Task } from '../models/task.model';
import { generateVariants } from './image.service';

export async function createTask(source: string) {
  const price = Number((Math.random() * (50 - 5) + 5).toFixed(2));
  const task = await Task.create({ status: 'pending', price, originalPath: source, images: [] });

  // procesado en background (no bloqueante)
  void (async () => {
    try {
      const variants = await generateVariants(source, [1024, 800]);
      task.images = variants;
      task.status = 'completed';
      await task.save();
    } catch (err: any) {      
      task.status = 'failed';
      task.error = err?.message || 'processing_error';
      await task.save();
    }
  })();

  return task;
}

export async function getTask(taskId: string) {
  const task = await Task.findById(taskId).lean();
  return task;
}