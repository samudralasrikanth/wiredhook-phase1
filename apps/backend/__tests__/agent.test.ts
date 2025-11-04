import request from 'supertest';
import app from '../src/server.js';

describe('Agent run endpoint', () => {
  it('returns 400 when payload invalid', async () => {
    const res = await request(app).post('/api/agent/run').send({});
    expect(res.status).toBe(400);
  });
});


