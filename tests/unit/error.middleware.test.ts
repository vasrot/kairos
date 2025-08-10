import { errorHandler } from '../../src/middleware/error.middleware';

describe('errorHandler middleware', () => {
  it('devuelve el status y mensaje correcto', () => {
    const err = { status: 418, message: 'I am a teapot' };
    const req = {} as any;
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as any;
    const next = jest.fn();
    errorHandler(err, req, res, next);
    expect(res.status).toHaveBeenCalledWith(418);
    expect(res.json).toHaveBeenCalledWith({ message: 'I am a teapot' });
  });

  it('devuelve 500 si no hay status', () => {
    const err = { message: 'Error' };
    const req = {} as any;
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as any;
    const next = jest.fn();
    errorHandler(err, req, res, next);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Error' });
  });
});
