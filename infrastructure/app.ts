import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';
import YAML from 'yaml';
import path from 'path';
import connectMongoDB from './config/mongodb.config';
import configureDependencies from './config/dependency.config';
import configureRoutes from './config/routes.config';
import { errorHandler } from './middleware/error.middleware';

const app = express();
app.use(helmet());
app.use(express.json());
app.use(morgan('dev'));

// Initialize configurations
connectMongoDB();
configureDependencies();
configureRoutes(app);

// Swagger UI
const openapiPath = path.resolve('openapi.yaml');
const openapiDoc = YAML.parse(fs.readFileSync(openapiPath, 'utf8'));
app.use('/docs', swaggerUi.serve, swaggerUi.setup(openapiDoc));

app.use(errorHandler);

export default app;