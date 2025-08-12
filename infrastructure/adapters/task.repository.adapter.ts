import { TaskRepositoryPort } from '../../domain/ports/task-repository.port';
import { TaskEntity, TaskImage } from '../../domain/models/task.model';
import { TaskModel } from '../persistence/mongoose/task.model';

export class TaskRepositoryAdapter implements TaskRepositoryPort {
  async create(source: string, price: number): Promise<{ id: string; status: TaskEntity['status']; price: number }> {
    const doc = await TaskModel.create({ status: 'pending', price, originalPath: source, images: [] });
    return { id: doc._id.toString(), status: doc.status, price: doc.price };
  }

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

  async markCompleted(taskId: string, images: TaskImage[]): Promise<void> {
    await TaskModel.updateOne({ _id: taskId }, { $set: { status: 'completed', images } }).exec();
  }

  async markFailed(taskId: string): Promise<void> {
    await TaskModel.updateOne({ _id: taskId }, { $set: { status: 'failed' } }).exec();
  }
}
