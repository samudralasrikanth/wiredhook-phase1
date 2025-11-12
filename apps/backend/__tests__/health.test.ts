import request from 'supertest';
import app from '../src/server.js';

describe('Health', () => {
  it('responds 200 on /api/health', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('ok', true);
  });
});


