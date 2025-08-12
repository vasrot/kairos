import express from 'express';
import tasksRouter from '../routes/tasks.routes';
import path from 'path';

const configureRoutes = (app: express.Application) => {
  const outputDir = process.env.OUTPUT_DIR || path.resolve('data/output');
  app.use('/output', express.static(outputDir));
  app.use('/tasks', tasksRouter);
};

export default configureRoutes;
