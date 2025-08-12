import request from 'supertest';
import { createApp } from '../../infrastructure/app';
import { TaskRepositoryAdapter } from '../../infrastructure/adapters/task.repository.adapter';
import { TaskAdapter } from '../../infrastructure/adapters/task.adapter';
import { TaskUseCase } from '../../application/usecases/task.usecase';
import { TasksController } from '../../infrastructure/web/controllers/tasks.controller';

const app = (() => {
    const repository = new TaskRepositoryAdapter();
    const adapter = new TaskAdapter(repository);
    const useCase = new TaskUseCase(adapter, repository);
    const controller = new TasksController(useCase);
    return createApp(controller);
})();

describe('App unit', () => {
it('GET /tasks responds 404 for unimplemented routes', async () => {
    const res = await request(app).get('/tasks');
    expect(res.status).toBe(404);
});

it('GET /anything responds 404', async () => {
    const res = await request(app).get('/anything');
    expect(res.status).toBe(404);
});
});
