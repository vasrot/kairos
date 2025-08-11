import { NextFunction, Request, Response } from 'express';
import { MongoServerError } from 'mongodb';
import createHttpError from 'http-errors';
import mongoose from 'mongoose';
import { LoggerService } from '../services/logger.service';

const logger = new LoggerService();

type ExtendedError = Error & Partial<MongoServerError> & Partial<createHttpError.HttpError> & { errors?: any[]; cause?: unknown };

export async function errorHandler(err: ExtendedError, req: Request, res: Response, _next: NextFunction) {
  await logger.logError(err);

  // Validación de taskId
  const taskId = (err as any).value;
  if (taskId && !mongoose.Types.ObjectId.isValid(taskId)) {
    return res.status(404).json({ message: 'Invalid taskId' });
  }

  // MongoDB errors
  if (err instanceof MongoServerError) {
    if (err.code === 11000) {
      return res.status(409).json({ message: 'Duplicate key error', details: err.keyValue });
    }
    return res.status(500).json({ message: 'Database error', details: err.message });
  }

  // Validation errors
  if (err.errors && Array.isArray(err.errors)) {
    return res.status(400).json({ message: 'Validation error', errors: err.errors });
  }

  // http-errors
  if (createHttpError.isHttpError?.(err)) {
    return res.status(err.statusCode || err.status || 500).json({ message: err.message });
  }

  // Image processing errors
  if (err.name === 'Error' && /sharp|image|Could not download image/i.test(err.message)) {
    return res.status(422).json({ message: 'Image processing error', details: err.message });
  }

  res.status(500).json({ message: err.message || 'Internal Server Error' });
}