import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import tasksRouter from './routes/tasks.routes';
import { errorHandler } from './middleware/error.middleware';
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';
import YAML from 'yaml';
import path from 'path';
import { Container } from 'typedi';
import { TaskUseCase } from '../application/usecases/task.usecase';
import { TaskAdapter } from './adapters/task.adapter';
import mongoose, { Document } from 'mongoose';
import { MongoDbAdapter } from './adapters/mongodb.adapter';
import { Task } from '../domain/models/task.model';

const app = express();
app.use(helmet());
app.use(express.json());
app.use(morgan('dev'));

// Dependency Injection
Container.set(TaskUseCase, new TaskUseCase(new TaskAdapter()));

// MongoDB Connection
const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/image_tasks';
mongoose.connect(uri).then(() => {
  console.log('MongoDB connected');
}).catch((err) => {
  console.error('Mongo connection error', err);
});

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
Container.set('TaskDbPort', new MongoDbAdapter(TaskModel));

// serve output directory as static
const outputDir = process.env.OUTPUT_DIR || path.resolve('data/output');
app.use('/output', express.static(outputDir));

// Swagger UI
const openapiPath = path.resolve('openapi.yaml');
const openapiDoc = YAML.parse(fs.readFileSync(openapiPath, 'utf8'));
app.use('/docs', swaggerUi.serve, swaggerUi.setup(openapiDoc));

app.use('/tasks', tasksRouter);
app.use(errorHandler);

export default app;