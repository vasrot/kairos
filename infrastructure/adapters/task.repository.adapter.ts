import { TaskRepositoryPort } from '../../domain/ports/task-repository.port';
import { TaskEntity, TaskImage } from '../../domain/models/task.model';
import { TaskModel } from '../persistence/mongoose/task.model';

export class TaskRepositoryAdapter implements TaskRepositoryPort {
    /**
     * Create a new task in the repository.
     * @param source Absolute path or URL of the input image
     * @param price Price of the task
     * @returns Promise with the newly created task basic info
     */
  async create(source: string, price: number): Promise<{ id: string; status: TaskEntity['status']; price: number }> {
    const doc = await TaskModel.create({ status: 'pending', price, originalPath: source, images: [] });
    return { id: doc._id.toString(), status: doc.status, price: doc.price };
  }

  /**
   * Find a task by its ID.
   * @param taskId Identifier of the task
   * @returns Task entity
   */
  async findById(taskId: string): Promise<TaskEntity | null> {
    const doc = await TaskModel.findById(taskId).lean();
    if (!doc) return null;
    return {
      id: doc._id.toString(),
      status: doc.status,
      price: doc.price,
      originalPath: doc.originalPath,
      images: (doc.images || []).map(i => ({ resolution: i.resolution, path: i.path })),
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }

  /**
   * Mark a task as completed and save the generated image variants.
   * @param taskId Identifier of the task
   * @param images Array of generated image variants
   */
  async markCompleted(taskId: string, images: TaskImage[]): Promise<void> {
    await TaskModel.updateOne({ _id: taskId }, { $set: { status: 'completed', images } }).exec();
  }

  /**
   * Mark a task as failed.
   * @param taskId Identifier of the task
   */
  async markFailed(taskId: string): Promise<void> {
    await TaskModel.updateOne({ _id: taskId }, { $set: { status: 'failed' } }).exec();
  }
}
