import request from 'supertest';
import app from '../src/app';

describe('Protected Endpoints', () => {
  let token: string;
  const email = `protected_${Date.now()}@example.com`;
  const password = 'Test1234!';

  beforeAll(async () => {
    await request(app)
      .post('/api/users/register')
      .send({ email, password });
    const res = await request(app)
      .post('/api/users/login')
      .send({ email, password });
    token = res.body.token;
  });

  it('should get user profile with JWT', async () => {
    const res = await request(app)
      .get('/api/users/me')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('user');
    expect(res.body.user).toHaveProperty('email', email);
  });

  it('should not get user profile without JWT', async () => {
    const res = await request(app)
      .get('/api/users/me');
    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty('error');
  });

  it('should get analytics user count with JWT', async () => {
    const res = await request(app)
      .get('/api/analytics/user-count')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('count');
    expect(typeof res.body.count).toBe('number');
  });

  it('should not get analytics user count without JWT', async () => {
    const res = await request(app)
      .get('/api/analytics/user-count');
    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty('error');
  });

  it('should get analytics summary with JWT', async () => {
    const res = await request(app)
      .get('/api/analytics/summary')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('userCount');
    expect(res.body).toHaveProperty('activeUsers');
    expect(res.body).toHaveProperty('newUsers');
  });

  it('should not get analytics summary without JWT', async () => {
    const res = await request(app)
      .get('/api/analytics/summary');
    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty('error');
  });
});

describe('Push Notifications', () => {
  const email = `push_${Date.now()}@example.com`;
  const password = 'Test1234!';
  let token: string;

  beforeAll(async () => {
    await request(app)
      .post('/api/users/register')
      .send({ email, password });
    const res = await request(app)
      .post('/api/users/login')
      .send({ email, password });
    token = res.body.token;
  });

  it('should register a push token', async () => {
    const res = await request(app)
      .post('/api/users/register-push-token')
      .set('Authorization', `Bearer ${token}`)
      .send({ pushToken: 'ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]' });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message');
  });

  it('should not register push token without token', async () => {
    const res = await request(app)
      .post('/api/users/register-push-token')
      .send({ pushToken: 'ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]' });
    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty('error');
  });

  it('should send a test push notification', async () => {
    jest.mock('../src/utils/push', () => ({
      sendPushNotification: jest.fn().mockResolvedValue(undefined),
    }));
    // Register push token first
    await request(app)
      .post('/api/users/register-push-token')
      .set('Authorization', `Bearer ${token}`)
      .send({ pushToken: 'ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]' });
    const res = await request(app)
      .post('/api/users/test-push')
      .set('Authorization', `Bearer ${token}`)
      .send({ message: 'Hello from test!' });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message');
  });

  it('should not send test push if no push token registered', async () => {
    // Register a new user without push token
    const email2 = `push2_${Date.now()}@example.com`;
    await request(app)
      .post('/api/users/register')
      .send({ email: email2, password });
    const loginRes = await request(app)
      .post('/api/users/login')
      .send({ email: email2, password });
    const token2 = loginRes.body.token;
    const res = await request(app)
      .post('/api/users/test-push')
      .set('Authorization', `Bearer ${token2}`)
      .send({ message: 'Should fail' });
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error');
  });
}); 