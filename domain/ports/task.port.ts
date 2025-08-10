export interface TaskPort {
  createTask(source: string): Promise<{ taskId: string; status: string; price: number }>;
  getTask(taskId: string): Promise<{ taskId: string; status: string; price: number; images?: { resolution: string; path: string }[] } | null>;
}
