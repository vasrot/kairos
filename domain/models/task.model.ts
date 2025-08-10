import mongoose, { Schema, Types } from 'mongoose';

export type TaskStatus = 'pending' | 'completed' | 'failed';

export interface ITask {
  _id: Types.ObjectId;
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

const TaskSchema = new Schema<ITask>({
  status: { type: String, enum: ['pending', 'completed', 'failed'], required: true, index: true },
  price: { type: Number, required: true, index: true },
  originalPath: { type: String, required: true },
  images: [{
    resolution: { type: String, required: true },
    path: { type: String, required: true, index: true }
  }],
}, { timestamps: true });

TaskSchema.index({ createdAt: -1 });

export const Task = mongoose.model<ITask>('Task', TaskSchema);

// Moved to domain layer