import request from 'supertest';
import app from '../../infrastructure/app';
import '../setup';

describe('Tasks Controller Integration', () => {
  it('POST /tasks creates a task and responds with taskId, status "pending" and assigned price', async () => {
    const res = await request(app)
      .post('/tasks')
      .send({ source: '/app/tests/fixtures/input/test.jpg' });
    expect(res.status).toBe(201);
    expect(res.body.taskId).toBeDefined();
    expect(res.body.status).toBe('pending');
    expect(typeof res.body.price).toBe('number');
  });

  it('GET /tasks/:taskId returns status and price if it is pending', async () => {
    const res = await request(app)
      .post('/tasks')
      .send({ source: '/app/tests/fixtures/input/test1.jpg' });
    const { taskId } = res.body;

    const pendingRes = await request(app).get(`/tasks/${taskId}`);

    expect(pendingRes.status).toBe(200);
    expect(pendingRes.body.status).toBe('pending');
    expect(typeof pendingRes.body.price).toBe('number');
    expect(pendingRes.body).not.toHaveProperty('originalPath');
    expect(pendingRes.body).not.toHaveProperty('images');
  });

  it('GET /tasks/:taskId returns status and price if it is completed', async () => {
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

  it('GET /tasks/:taskId with a non-existent id returns 404', async () => {
    const fakeId = '64b8b437d8a25104c1b45103';
    const res = await request(app).get(`/tasks/${fakeId}`);
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('message');
  });
});