import { TaskPort } from '../../domain/ports/task.port';
import { TaskModel } from '../persistence/mongoose/task.model';
import { generateVariants } from '../services/image.service';

export class TaskAdapter implements TaskPort {
  async createTask(source: string) {
    const price = Number((Math.random() * (50 - 5) + 5).toFixed(2));
  const task = await TaskModel.create({ status: 'pending', price, originalPath: source, images: [] });

    void (async () => {
      try {
        const variants = await generateVariants(source, [1024, 800]);
        task.images = variants;
        task.status = 'completed';
  await task.save();
      } catch (err: unknown) {
        task.status = 'failed';
        await task.save();
      }
    })();

    return { taskId: task._id.toString(), status: task.status, price: task.price };
  }

  async getTask(taskId: string) {
  const task = await TaskModel.findById(taskId).lean();
    if (!task) return null;

    const { _id, status, price, images } = task;
    return {
      taskId: _id.toString(),
      status,
      price,
      images: images?.map(({ resolution, path }: { resolution: string; path: string }) => ({ resolution, path }))
    };
  }
}
