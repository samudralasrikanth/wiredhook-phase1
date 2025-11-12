import request from 'supertest';
import app from '../src/server';

describe('Users API', () => {
  it('should get all users', async () => {
    const res = await request(app).get('/api/users');
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(2);
  });

  it('should create a new user', async () => {
    const res = await request(app)
      .post('/api/users')
      .send({ name: 'Test User' });
    expect(res.status).toBe(201);
    expect(res.body.name).toBe('Test User');
  });

  it('should return 400 if name is not provided when creating a user', async () => {
    const res = await request(app).post('/api/users').send({});
    expect(res.status).toBe(400);
  });

  it('should delete a user', async () => {
    const getRes = await request(app).get('/api/users');
    const userId = getRes.body[0].id;
    const deleteRes = await request(app).delete(`/api/users/${userId}`);
    expect(deleteRes.status).toBe(204);
  });

  it('should return 404 if user to delete is not found', async () => {
    const res = await request(app).delete('/api/users/non-existent-id');
    expect(res.status).toBe(404);
  });
});