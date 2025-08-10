import request from 'supertest';
import app from '../../src/app';
import '../setup';

describe('Tasks Controller Integration', () => {
  it('POST /tasks crea una tarea y responde con taskId, status "pending" y precio asignado', async () => {
    const res = await request(app)
      .post('/tasks')
      .send({ source: '/app/tests/fixtures/input/test.jpg' });
    expect(res.status).toBe(201);
    expect(res.body.taskId).toBeDefined();
    expect(res.body.status).toBe('pending');
    expect(typeof res.body.price).toBe('number');
  });

  it('GET /tasks/:taskId devuelve el estado y precio si está pendiente', async () => {
    const res = await request(app)
      .post('/tasks')
      .send({ source: '/app/tests/fixtures/input/test1.jpg' });
    const { taskId } = res.body;

    const pendingRes = await request(app).get(`/tasks/${taskId}`);

    expect(pendingRes.status).toBe(200);
    expect(pendingRes.body.status).toBe('pending');
    expect(typeof pendingRes.body.price).toBe('number');
    expect(pendingRes.body).not.toHaveProperty('originalPath');
  });

  it('GET /tasks/:taskId devuelve el estado y precio si está completada', async () => {
    const res = await request(app)
      .post('/tasks')
      .send({ source: '/app/tests/fixtures/input/test2.jpg' });
    const { taskId } = res.body;

    await new Promise(resolve => setTimeout(resolve, 1000));

    const completedRes = await request(app).get(`/tasks/${taskId}`);

    expect(completedRes.status).toBe(200);
    expect(completedRes.body.status).toBe('completed');
    expect(typeof completedRes.body.price).toBe('number');
  });
});