import express, { Express } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import createTasksRouter from './routes/tasks.routes';
import { errorHandler } from './middleware/error.middleware';
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';
import YAML from 'yaml';
import path from 'path';
import { TasksController } from './web/controllers/tasks.controller';

export function createApp(controller: TasksController): Express {
	const app = express();
	app.use(helmet());
	app.use(express.json());
	app.use(morgan('dev'));

	// serve output directory as static
	const outputDir = process.env.OUTPUT_DIR || path.resolve('data/output');
	app.use('/output', express.static(outputDir));

	// Swagger UI
	const openapiPath = path.resolve('openapi.yaml');
	const openapiDoc = YAML.parse(fs.readFileSync(openapiPath, 'utf8'));
	app.use('/docs', swaggerUi.serve, swaggerUi.setup(openapiDoc));

	app.use('/tasks', createTasksRouter(controller));
	app.use(errorHandler);

	return app;
}

// Default app instance (useful for tests). For production, index.ts wires dependencies explicitly.
import { TaskAdapter } from './adapters/task.adapter';
import { TaskUseCase } from '../application/usecases/task.usecase';
const defaultApp = (() => {
	const taskAdapter = new TaskAdapter();
	const taskUseCase = new TaskUseCase(taskAdapter);
	const tasksController = new TasksController(taskUseCase);
	return createApp(tasksController);
})();

export default defaultApp;