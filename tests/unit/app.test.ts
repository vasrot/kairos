import request from 'supertest';
import app from '../../infrastructure/app';

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
