import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import tasksRouter from './routes/tasks.routes';
import { errorHandler } from './middleware/error.middleware';
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';
import YAML from 'yaml';
import path from 'path';

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

app.use('/tasks', tasksRouter);
app.use(errorHandler);

export default app;