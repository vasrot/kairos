jest.mock('fs/promises', () => ({
  appendFile: jest.fn().mockResolvedValue(undefined),
  mkdir: jest.fn().mockResolvedValue(undefined),
}));

import { errorHandler } from '../../infrastructure/middleware/error.middleware';
import { MongoServerError } from 'mongodb';
import createHttpError from 'http-errors';

describe('errorHandler middleware', () => {
it('returns 409 and duplicate key message for MongoServerError 11000', async () => {
    const err = new MongoServerError({ message: 'E11000 duplicate key', code: 11000, keyValue: { foo: 'bar' }, cause: undefined });
    const req = {} as any;
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as any;
    const next = jest.fn();
    await errorHandler(err, req, res, next);
    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledWith({ message: 'Duplicate key error', details: { foo: 'bar' } });
});

it('returns 500 and database error message for other MongoServerError', async () => {
    const err = new MongoServerError({ message: 'Some mongo error', code: 123, cause: undefined });
    const req = {} as any;
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as any;
    const next = jest.fn();
    await errorHandler(err, req, res, next);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Database error', details: 'Some mongo error' });
});

it('returns the correct status and message for http-errors', async () => {
    const err = createHttpError(404, 'Not found', { cause: undefined });
    const req = {} as any;
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as any;
    const next = jest.fn();
    await errorHandler(err, req, res, next);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Not found' });
});

it('returns 422 for image processing errors', async () => {
    const err = { name: 'Error', message: 'sharp: some error', cause: undefined } as Error;
    const req = {} as any;
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as any;
    const next = jest.fn();
    await errorHandler(err, req, res, next);
    expect(res.status).toHaveBeenCalledWith(422);
    expect(res.json).toHaveBeenCalledWith({ message: 'Image processing error', details: 'sharp: some error' });
});

it('returns 400 for validation errors', async () => {
    const err = { name: 'ValidationError', message: 'Validation failed', errors: [{ msg: 'error' }], cause: undefined } as Error & { errors: any[] };
    const req = {} as any;
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as any;
    const next = jest.fn();
    await errorHandler(err, req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Validation error', errors: [{ msg: 'error' }] });
});

it('returns 500 for general errors', async () => {
    const err = { name: 'Error', message: 'Error', cause: undefined } as Error;
    const req = {} as any;
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as any;
    const next = jest.fn();
    await errorHandler(err, req, res, next);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Error' });
});
});
