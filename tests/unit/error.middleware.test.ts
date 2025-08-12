import express from 'express';
import request from 'supertest';
import createHttpError from 'http-errors';
import { MongoServerError } from 'mongodb';
import { errorHandler } from '../../infrastructure/middleware/error.middleware';

jest.mock('../../infrastructure/logger/logger', () => ({
	logger: {
		error: jest.fn().mockResolvedValue(undefined),
		info: jest.fn(),
		warn: jest.fn()
	}
}));

import { logger } from '../../infrastructure/logger/logger';

describe('errorHandler middleware (SuperTest)', () => {
	const mockedLogger = logger as jest.Mocked<typeof logger>;

	function appWithErrorFactory(errFactory: () => Error) {
		const app = express();
		app.get('/test', (_req, _res, next) => {
			next(errFactory());
		});
		app.use(errorHandler);
		return app;
	}

	const makeMongoServerError = (
		code?: number,
		keyValue?: Record<string, string>,
		message = 'Mongo error'
	) => {
		const err = new Error(message) as MongoServerError & {
			code?: number;
			keyValue?: Record<string, string>;
		};
		Object.setPrototypeOf(err, MongoServerError.prototype);
		if (code !== undefined) err.code = code;
		if (keyValue) err.keyValue = keyValue;
		return err as MongoServerError;
	};

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('returns 404 for CastError', async () => {
		const app = appWithErrorFactory(() => {
			const err = new Error('Cast to ObjectId failed');
			err.name = 'CastError';
			return err;
		});

		const res = await request(app).get('/test');

		expect(mockedLogger.error).toHaveBeenCalled();
		expect(res.status).toBe(404);
		expect(res.body).toEqual({ message: 'Task not found' });
	});

	it('returns 409 for MongoServerError with duplicate key (11000)', async () => {
		const keyValue: Record<string, string> = { filename: 'test.jpg' };
		const app = appWithErrorFactory(() => makeMongoServerError(11000, keyValue, 'E11000 duplicate key error'));

		const res = await request(app).get('/test');

		expect(mockedLogger.error).toHaveBeenCalled();
		expect(res.status).toBe(409);
		expect(res.body).toEqual({ message: 'Duplicate key error', details: keyValue });
	});

	it('returns 500 for MongoServerError other than 11000', async () => {
		const app = appWithErrorFactory(() => makeMongoServerError(121, undefined, 'Some mongo error'));

		const res = await request(app).get('/test');

		expect(mockedLogger.error).toHaveBeenCalled();
		expect(res.status).toBe(500);
		expect(res.body).toEqual({ message: 'Database error', details: 'Some mongo error' });
	});

	it('handles http-errors with proper status and message', async () => {
		const app = appWithErrorFactory(() => createHttpError(418, 'I am a teapot'));

		const res = await request(app).get('/test');

		expect(mockedLogger.error).toHaveBeenCalled();
		expect(res.status).toBe(418);
		expect(res.body).toEqual({ message: 'I am a teapot' });
	});

	it('returns 422 for sharp/image processing errors', async () => {
		const app = appWithErrorFactory(() => new Error('sharp processing failed: invalid image'));

		const res = await request(app).get('/test');

		expect(mockedLogger.error).toHaveBeenCalled();
		expect(res.status).toBe(422);
		expect(res.body).toEqual({ message: 'Image processing error', details: 'sharp processing failed: invalid image' });
	});

	it('returns 500 for other errors', async () => {
		const app = appWithErrorFactory(() => new Error('Unexpected'));

		const res = await request(app).get('/test');

		expect(mockedLogger.error).toHaveBeenCalled();
		expect(res.status).toBe(500);
		expect(res.body).toEqual({ message: 'Unexpected' });
	});
});

