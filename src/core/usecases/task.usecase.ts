import { TaskPort } from '../ports/task.port';

export class TaskUseCase {
  constructor(private readonly taskPort: TaskPort) {}

  async createTask(source: string) {
    return this.taskPort.createTask(source);
  }

  async getTask(taskId: string) {
    return this.taskPort.getTask(taskId);
  }
}
