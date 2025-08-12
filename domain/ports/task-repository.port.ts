import { TaskEntity, TaskImage, TaskStatus } from '../models/task.model';

export interface TaskRepositoryPort {
  create(source: string, price: number): Promise<{ id: string; status: TaskStatus; price: number }>;
  findById(taskId: string): Promise<TaskEntity | null>;
  markCompleted(taskId: string, images: TaskImage[]): Promise<void>;
  markFailed(taskId: string): Promise<void>;
}
