import { TaskAdapter } from '../adapters/task.adapter';

const taskAdapter = new TaskAdapter();

export async function createTask(source: string) {
  return taskAdapter.createTask(source);
}

export async function getTask(taskId: string) {
  return taskAdapter.getTask(taskId);
}