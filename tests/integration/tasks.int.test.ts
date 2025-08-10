import request from 'supertest';
import app from '../../src/app';
import '../setup';

describe('Tasks Controller Integration', () => {
  it('POST /tasks crea una tarea y responde con taskId, status "pending" y precio asignado', async () => {
    const res = await request(app)
      .post('/tasks')
      .send({ source: '/app/tests/fixtures/test.jpg' });
    expect(res.status).toBe(201);
    expect(res.body.taskId).toBeDefined();
    expect(res.body.status).toBe('pending');
    expect(typeof res.body.price).toBe('number');
  });

});