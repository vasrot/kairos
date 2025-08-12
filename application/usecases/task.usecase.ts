import { TaskPort } from '../../domain/ports/task.port';
import { TaskRepositoryPort } from '../../domain/ports/task-repository.port';

export class TaskUseCase {
  /**
   * Create a TaskUseCase
   * @param taskPort Port that triggers task creation and async processing
   * @param taskRepository Repository port to read task state from persistence
   */
  constructor(
    private readonly taskPort: TaskPort,
    private readonly taskRepository: TaskRepositoryPort,
  ) {}

  /**
   * Create a new processing task from a source image path or URL.
   * @param source Absolute path or URL of the input image
   * @returns Promise with the newly created task basic info
   */
  async createTask(source: string) {
    const result = await this.taskPort.createTask(source);
    return result;
  }

  /**
   * Get task current status and results mapped to a view model.
   * @param taskId Identifier of the task
   * @returns Task view model or null if not found
   */
  async getTask(taskId: string) {
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
