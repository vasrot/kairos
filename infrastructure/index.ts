import dotenv from 'dotenv';
import app, { createApp } from './app';
import { TaskAdapter } from './adapters/task.adapter';
import { TaskUseCase } from '../application/usecases/task.usecase';
import { TasksController } from './web/controllers/tasks.controller';
import { TaskRepositoryAdapter } from './adapters/task.repository.adapter';
import './db';
import { logger } from './logger/logger';

dotenv.config();

const PORT = process.env.PORT || 3000;
const productionApp = (() => {
  const repository = new TaskRepositoryAdapter();
  const adapter = new TaskAdapter(repository);
  const useCase = new TaskUseCase(adapter, repository);
  const controller = new TasksController(useCase);
  return createApp(controller);
})();

productionApp.listen(PORT, () => {
  logger.info(`API listening on :${PORT}`);
});