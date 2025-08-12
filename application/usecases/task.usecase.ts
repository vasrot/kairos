import { TaskPort } from '../../domain/ports/task.port';
import { TaskRepositoryPort } from '../../domain/ports/task-repository.port';

export class TaskUseCase {
  constructor(
    private readonly taskPort: TaskPort,
    private readonly taskRepository: TaskRepositoryPort,
  ) {}

  async createTask(source: string) {
    // Delegate to adapter to start processing OR orchestrate price then persist
    // For now, keep behavior: use adapter to start async process and persist via repository
    const result = await this.taskPort.createTask(source);
    return result;
  }

  async getTask(taskId: string) {
    // Query repository for stronger domain contract
    const entity = await this.taskRepository.findById(taskId);
    if (!entity) return null;

    const { id, status, price, images } = entity;
    return {
      taskId: id,
      status,
      price,
      images: images?.map(i => ({ resolution: i.resolution, path: i.path }))
    };
  }
}
