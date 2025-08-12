export type TaskStatus = 'pending' | 'completed' | 'failed';

export interface TaskImage {
  resolution: string;
  path: string;
}

export interface TaskEntity {
  id: string;
  status: TaskStatus;
  price: number;
  originalPath: string;
  images: TaskImage[];
  createdAt: Date;
  updatedAt: Date;
}
