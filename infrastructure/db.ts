import mongoose from 'mongoose';
import { logger } from './logger/logger';

const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/image_tasks';

mongoose.connect(uri).then(() => {
  logger.info('MongoDB connected');
}).catch((err) => {
  logger.error(`Mongo connection error: ${(err as Error).message}`);
});