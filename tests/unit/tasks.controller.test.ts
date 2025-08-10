import { createTask, getTask } from '../../application/controllers/tasks.controller';
import createHttpError from 'http-errors';

describe('tasks.controller', () => {
  describe('createTask', () => {
    it('responde 201 y task info', async () => {
      const req = { body: { source: 'img.jpg' } } as any;
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as any;
      const fakeTask = { _id: 'id', status: 'pending', price: 42 };
      jest.spyOn(require('../../infrastructure/services/task.service'), 'createTask').mockResolvedValue(fakeTask);
      await createTask(req, res);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ taskId: 'id', status: 'pending', price: 42 });
    });
  });

  describe('getTask', () => {
    it('responde con status y price si pending', async () => {
      const req = { params: { taskId: 'id' } } as any;
      const res = { json: jest.fn() } as any;
      const fakeTask = { _id: 'id', status: 'pending', price: 10, images: [] };
      jest.spyOn(require('../../infrastructure/services/task.service'), 'getTask').mockResolvedValue(fakeTask);
      await getTask(req, res);
      expect(res.json).toHaveBeenCalledWith({ status: 'pending', price: 10 });
    });
    
    it('responde con status, price e images si completed', async () => {
      const req = { params: { taskId: 'id' } } as any;
      const res = { json: jest.fn() } as any;
      const fakeTask = { _id: 'id', status: 'completed', price: 20, images: [{ resolution: '800', path: 'a.jpg' }] };
      jest.spyOn(require('../../infrastructure/services/task.service'), 'getTask').mockResolvedValue(fakeTask);
      await getTask(req, res);
      expect(res.json).toHaveBeenCalledWith({ taskId: 'id', status: 'completed', price: 20, images: [{ resolution: '800', path: 'a.jpg' }] });
    });

    it('lanza 404 si no existe', async () => {
      const req = { params: { taskId: 'id' } } as any;
      const res = {} as any;
      jest.spyOn(require('../../infrastructure/services/task.service'), 'getTask').mockResolvedValue(null);
      await expect(getTask(req, res)).rejects.toThrow(createHttpError.NotFound);
    });
  });
});
