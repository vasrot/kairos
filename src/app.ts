import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import tasksRouter from './routes/tasks.routes';
import path from 'path';

const app = express();
app.use(helmet());
app.use(express.json());
app.use(morgan('dev'));

// servir directorio de salida como estático
const outputDir = process.env.OUTPUT_DIR || path.resolve('data/output');
app.use('/output', express.static(outputDir));

app.use('/tasks', tasksRouter);

export default app;