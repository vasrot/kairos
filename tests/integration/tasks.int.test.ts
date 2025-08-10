import request from 'supertest';
import mongoose from 'mongoose';
import app from '../../src/app';
import '../setup';

let createdId: string;

describe('Tasks flow', () => {
  it('POST /tasks creates a pending task with price', async () => {
    const res = await request(app).post('/tasks').send({ source: 'https://picsum.photos/1200/800.jpg' });
    expect(res.status).toBe(201);
    expect(res.body.taskId).toBeDefined();
    expect(res.body.status).toBe('pending');
    expect(typeof res.body.price).toBe('number');
    createdId = res.body.taskId;
  });

  it('GET /tasks/:id returns pending or completed', async () => {
    const res = await request(app).get(`/tasks/${createdId}`);
    expect(res.status).toBe(200);
    expect(res.body.status).toMatch(/pending|completed|failed/);
  });

  it('GET /tasks/404 returns 404', async () => {
    const res = await request(app).get(`/tasks/${new mongoose.Types.ObjectId()}`);
    expect(res.status).toBe(404);
  });
});