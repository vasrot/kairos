import { NextFunction, Request, Response } from 'express';
import { MongoServerError } from 'mongodb';
import createHttpError from 'http-errors';
import { logger } from '../logger/logger';

export async function errorHandler(err: Error, req: Request, res: Response, _next: NextFunction) {
  await logger.error(err);

  if (err.name === 'CastError') {
    return res.status(404).json({ message: 'Task not found' });
  }

  // MongoDB errors
  if (err instanceof MongoServerError) {
    if ((err as MongoServerError).code === 11000) {
      return res.status(409).json({ message: 'Duplicate key error', details: (err as MongoServerError).keyValue });
    }
    return res.status(500).json({ message: 'Database error', details: (err as Error).message });
  }

  // http-errors
  if (createHttpError.isHttpError?.(err)) {
    const httpErr = err;
    return res.status(httpErr.statusCode || httpErr.status || 500).json({ message: httpErr.message });
  }

  // Sharp/image processing errors
  if (err?.name === 'Error' && /sharp|image|Could not download image/i.test(err.message)) {
    return res.status(422).json({ message: 'Image processing error', details: err.message });
  }

  // Other errors
  res.status(500).json({ message: err.message || 'Internal Server Error' });
}