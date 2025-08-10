jest.mock('fs/promises', () => ({
  appendFile: jest.fn().mockResolvedValue(undefined),
  mkdir: jest.fn().mockResolvedValue(undefined),
}));

import { errorHandler } from '../../infrastructure/middleware/error.middleware';
import { MongoServerError } from 'mongodb';
import createHttpError from 'http-errors';

describe('errorHandler middleware', () => {
  it('devuelve 409 y mensaje de duplicate key para MongoServerError 11000', async () => {
    const err = new MongoServerError({ message: 'E11000 duplicate key', code: 11000, keyValue: { foo: 'bar' } });
    const req = {} as any;
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as any;
    const next = jest.fn();
    await errorHandler(err, req, res, next);
    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledWith({ message: 'Duplicate key error', details: { foo: 'bar' } });
  });

  it('devuelve 500 y mensaje de database error para otros MongoServerError', async () => {
    const err = new MongoServerError({ message: 'Some mongo error', code: 123 });
    const req = {} as any;
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as any;
    const next = jest.fn();
    await errorHandler(err, req, res, next);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Database error', details: 'Some mongo error' });
  });

  it('devuelve el status y mensaje correcto para http-errors', async () => {
    const err = createHttpError(404, 'Not found');
    const req = {} as any;
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as any;
    const next = jest.fn();
    await errorHandler(err, req, res, next);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Not found' });
  });

  it('devuelve 422 para errores de procesamiento de imagen', async () => {
    const err = { name: 'Error', message: 'sharp: some error' };
    const req = {} as any;
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as any;
    const next = jest.fn();
    await errorHandler(err, req, res, next);
    expect(res.status).toHaveBeenCalledWith(422);
    expect(res.json).toHaveBeenCalledWith({ message: 'Image processing error', details: 'sharp: some error' });
  });

  it('devuelve 400 para errores de validación', async () => {
    const err = { errors: [{ msg: 'error' }] };
    const req = {} as any;
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as any;
    const next = jest.fn();
    await errorHandler(err, req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Validation error', errors: [{ msg: 'error' }] });
  });

  it('devuelve 500 para errores generales', async () => {
    const err = { message: 'Error' };
    const req = {} as any;
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as any;
    const next = jest.fn();
    await errorHandler(err, req, res, next);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Error' });
  });
});
