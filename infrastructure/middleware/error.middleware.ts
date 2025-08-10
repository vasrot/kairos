import { NextFunction, Request, Response } from 'express';
import { MongoServerError } from 'mongodb';
import createHttpError from 'http-errors';
import fs from 'fs/promises';
import path from 'path';
import mongoose from 'mongoose';

const LOG_PATH = path.resolve('logs/error.log');

async function logError(err: any) {
  const entry = `[${new Date().toISOString()}] ${err?.stack || err?.message || err}\n`;
  try {
    await fs.mkdir(path.dirname(LOG_PATH), { recursive: true });
    await fs.appendFile(LOG_PATH, entry);
  } catch (e) {
    // Do not throw error if logging fails
    console.error('Error writing to log:', e);
  }
}

export async function errorHandler(err: any, req: Request, res: Response, _next: NextFunction) {
  await logError(err);

  // Validación de taskId
  const taskId = err.value;
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

  // http-errors
  if (createHttpError.isHttpError?.(err)) {
    return res.status(err.statusCode || err.status || 500).json({ message: err.message });
  }

  // Sharp/image processing errors
  if (err?.name === 'Error' && /sharp|image|Could not download image/i.test(err.message)) {
    return res.status(422).json({ message: 'Image processing error', details: err.message });
  }

  // Validation errors (express-validator)
  if (err?.errors && Array.isArray(err.errors)) {
    return res.status(400).json({ message: 'Validation error', errors: err.errors });
  }

  // Other errors
  res.status(500).json({ message: err.message || 'Internal Server Error' });
}