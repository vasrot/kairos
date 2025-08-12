import { TaskPort } from '../../domain/ports/task.port';
import { generateVariants } from '../services/image.service';
import { TaskRepositoryPort } from '../../domain/ports/task-repository.port';

export class TaskAdapter implements TaskPort {
  constructor(private readonly repository: TaskRepositoryPort) {}

  /**
   * Create a new task, persist it, and start background variant generation.
   * @param source Absolute path or URL of the input image
   * @returns Promise with the newly created task basic info
   */
  async createTask(source: string) {
    const price = Number((Math.random() * (50 - 5) + 5).toFixed(2));
    const { id, status, price: createdPrice } = await this.repository.create(source, price);

    void (async () => {
      try {
        const variants = await generateVariants(source, [1024, 800]);
        await this.repository.markCompleted(id, variants);
      } catch (err) {
        await this.repository.markFailed(id);
      }
    })();

    return { taskId: id, status, price: createdPrice };
  }

  /**
   * Get the current status and results of a task.
   * @param taskId Identifier of the task
   * @returns Task view model
   */
  async getTask(taskId: string) {
    const task = await this.repository.findById(taskId);
    if (!task) return null;
    return { taskId: task.id, status: task.status, price: task.price, images: task.images };
  }
}
