import { TaskPort } from '../../domain/ports/task.port';
import { Task } from '../../domain/models/task.model';
import { generateVariants } from '../services/image.service';

const tasks: Task[] = []; // Temporary in-memory storage

export class TaskAdapter implements TaskPort {
  async createTask(source: string) {
    const price = Number((Math.random() * (50 - 5) + 5).toFixed(2));
    const task = new Task(
      `task-${Date.now()}`,
      `id-${Date.now()}`,
      'pending',
      price,
      source,
      [],
      new Date(),
      new Date()
    );

    tasks.push(task);

    void (async () => {
      try {
        const variants = await generateVariants(source, [1024, 800]);
        task.images = variants;
        task.status = 'completed';
      } catch (err) {
        task.status = 'failed';
      }
    })();

    return { taskId: task.taskId, status: task.status, price: task.price };
  }

  async getTask(taskId: string) {
    const task = tasks.find((t) => t.taskId === taskId);
    if (!task) return null;

    const { taskId: id, status, price, images } = task;
    return {
      taskId: id,
      status,
      price,
      images: images.map(({ resolution, path }) => ({ resolution, path }))
    };
  }
}
