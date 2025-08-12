import { Container } from 'typedi';
import { TaskUseCase } from '../../application/usecases/task.usecase';
import { TaskAdapter } from '../adapters/task.adapter';
import { MongoDbAdapter } from '../adapters/mongodb.adapter';
import mongoose, { Document } from 'mongoose';

interface TaskDocument extends Document {
  taskId: string;
  id: string;
  status: string;
  price: number;
  originalPath: string;
  images: { resolution: string; path: string }[];
  createdAt: Date;
  updatedAt: Date;
}

const taskSchema = new mongoose.Schema<TaskDocument>({
  taskId: { type: String, required: true },
  id: { type: String, required: true },
  status: { type: String, required: true },
  price: { type: Number, required: true },
  originalPath: { type: String, required: true },
  images: [{ resolution: String, path: String }],
  createdAt: { type: Date, required: true },
  updatedAt: { type: Date, required: true }
});

const TaskModel = mongoose.model<TaskDocument>('Task', taskSchema);

const configureDependencies = () => {
  Container.set(TaskUseCase, new TaskUseCase(new TaskAdapter()));
  Container.set('TaskDbPort', new MongoDbAdapter(TaskModel));
};

export default configureDependencies;
