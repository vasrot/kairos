import request from 'supertest';
import app from '../../src/app';

describe('App unit', () => {
  it('GET /tasks responde 404 para rutas no implementadas', async () => {
    const res = await request(app).get('/tasks');
    expect(res.status).toBe(404);
  });

  it('GET /cualquier-cosa responde 404', async () => {
    const res = await request(app).get('/cualquier-cosa');
    expect(res.status).toBe(404);
  });
});
