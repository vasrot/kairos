import { NextFunction, Request, Response } from 'express';
import { MongoServerError } from 'mongodb';
import createHttpError from 'http-errors';
import { logger } from '../logger/logger';

export async function errorHandler(err: unknown, req: Request, res: Response, _next: NextFunction) {
  await logger.error(err);

  // MongoDB errors
  if (err instanceof MongoServerError) {
    if ((err as MongoServerError).code === 11000) {
      return res.status(409).json({ message: 'Duplicate key error', details: (err as MongoServerError).keyValue });
    }
    return res.status(500).json({ message: 'Database error', details: (err as Error).message });
  }

  // http-errors
  if (createHttpError.isHttpError?.(err)) {
    const httpErr = err as any;
    return res.status(httpErr.statusCode || httpErr.status || 500).json({ message: httpErr.message });
  }

  // Sharp/image processing errors
  if ((err as any)?.name === 'Error' && /sharp|image|Could not download image/i.test((err as any).message)) {
    return res.status(422).json({ message: 'Image processing error', details: (err as any).message });
  }

  // Validation errors (express-validator)
  if ((err as any)?.errors && Array.isArray((err as any).errors)) {
    return res.status(400).json({ message: 'Validation error', errors: (err as any).errors });
  }

  // Other errors
  res.status(500).json({ message: (err as any)?.message || 'Internal Server Error' });
}