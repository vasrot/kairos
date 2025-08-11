export type TaskStatus = 'pending' | 'completed' | 'failed';

export interface ITask {
  taskId: string;
  id: string;
  status: TaskStatus;
  price: number;
  originalPath: string;
  images: {
    resolution: string;
    path: string;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

export class Task implements ITask {
  constructor(
    public taskId: string,
    public id: string,
    public status: TaskStatus,
    public price: number,
    public originalPath: string,
    public images: {
      resolution: string;
      path: string;
    }[],
    public createdAt: Date,
    public updatedAt: Date
  ) {}
}