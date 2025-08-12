import dotenv from 'dotenv';
import app, { createApp } from './app';
import { TaskAdapter } from './adapters/task.adapter';
import { TaskUseCase } from '../application/usecases/task.usecase';
import { TasksController } from './web/controllers/tasks.controller';
import './db';
import { logger } from './logger/logger';

dotenv.config();

const PORT = process.env.PORT || 3000;
const productionApp = (() => {
  const adapter = new TaskAdapter();
  const useCase = new TaskUseCase(adapter);
  const controller = new TasksController(useCase);
  return createApp(controller);
})();

productionApp.listen(PORT, () => {
  logger.info(`API listening on :${PORT}`);
});