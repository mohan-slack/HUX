import request from 'supertest';
import app from '../src/app';

// Utility to delete test users by email prefix
async function cleanupTestUsers(prefix: string) {
  const { prisma } = await import('../src/services/user.service');
  await prisma.user.deleteMany({ where: { email: { startsWith: prefix } } });
}

describe('Admin/Analytics Endpoints', () => {
  const emailPrefix = `admin_test_${Date.now()}`;
  const email = `${emailPrefix}@example.com`;
  const password = 'Test1234!';
  let token: string;
  let userId: string;

  beforeAll(async () => {
    // Clean up any old test users
    await cleanupTestUsers(emailPrefix);
    // Register and login a user
    const regRes = await request(app)
      .post('/api/users/register')
      .send({ email, password });
    userId = regRes.body.id;
    const loginRes = await request(app)
      .post('/api/users/login')
      .send({ email, password });
    token = loginRes.body.token;
  });

  afterAll(async () => {
    await cleanupTestUsers(emailPrefix);
  });

  it('should get user by ID (admin/demo)', async () => {
    const res = await request(app)
      .get(`/api/users/${userId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('id', userId);
    expect(res.body).toHaveProperty('email', email);
  });

  it('should return 404 for invalid user ID', async () => {
    const res = await request(app)
      .get('/api/users/invalid-id')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('error');
  });

  it('should get analytics registrations by day', async () => {
    const res = await request(app)
      .get('/api/analytics/registrations-by-day')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0]).toHaveProperty('date');
    expect(res.body[0]).toHaveProperty('count');
  });

  it('should get analytics active vs inactive', async () => {
    const res = await request(app)
      .get('/api/analytics/active-vs-inactive')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('active');
    expect(res.body).toHaveProperty('inactive');
  });
}); 