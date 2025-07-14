import request from 'supertest';
import app from '../src/app';

describe('User Auth API', () => {
  const uniqueEmail = () => `testuser_${Date.now()}@example.com`;

  it('should register a new user', async () => {
    const email = uniqueEmail();
    const res = await request(app)
      .post('/api/users/register')
      .send({ email, password: 'Test1234!' });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('id');
    expect(res.body).toHaveProperty('email', email);
  });

  it('should not register the same user twice', async () => {
    const email = uniqueEmail();
    await request(app)
      .post('/api/users/register')
      .send({ email, password: 'Test1234!' });
    const res = await request(app)
      .post('/api/users/register')
      .send({ email, password: 'Test1234!' });
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  it('should login with correct credentials', async () => {
    const email = uniqueEmail();
    await request(app)
      .post('/api/users/register')
      .send({ email, password: 'Test1234!' });
    const res = await request(app)
      .post('/api/users/login')
      .send({ email, password: 'Test1234!' });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body).toHaveProperty('user');
    expect(res.body.user).toHaveProperty('email', email);
  });
});

describe('Password Reset', () => {
  const email = `pwreset_${Date.now()}@example.com`;
  const password = 'Test1234!';

  beforeAll(async () => {
    await request(app)
      .post('/api/users/register')
      .send({ email, password });
  });

  it('should request a password reset', async () => {
    // Mock sendMail to avoid sending real emails
    jest.mock('../src/utils/mail', () => ({
      sendMail: jest.fn().mockResolvedValue(undefined),
    }));
    const res = await request(app)
      .post('/api/users/reset-password-request')
      .send({ email });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message');
  });

  it('should not request reset for unknown email', async () => {
    const res = await request(app)
      .post('/api/users/reset-password-request')
      .send({ email: 'unknown@example.com' });
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  it('should reset password with valid token', async () => {
    // Get reset token from DB
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();
    await request(app)
      .post('/api/users/reset-password-request')
      .send({ email });
    const tokenRecord = await prisma.passwordResetToken.findFirst({
      where: { user: { email } },
      orderBy: { createdAt: 'desc' },
    });
    expect(tokenRecord).toBeTruthy();
    const res = await request(app)
      .post('/api/users/reset-password')
      .send({ token: tokenRecord.token, newPassword: 'NewPass123!' });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message');
    await prisma.$disconnect();
  });

  it('should not reset password with invalid token', async () => {
    const res = await request(app)
      .post('/api/users/reset-password')
      .send({ token: 'invalidtoken', newPassword: 'NewPass123!' });
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error');
  });
});

describe('Edge Cases & Other Endpoints', () => {
  const email = `edge_${Date.now()}@example.com`;
  const password = 'Test1234!';
  let token: string;
  let userId: string;

  beforeAll(async () => {
    const regRes = await request(app)
      .post('/api/users/register')
      .send({ email, password });
    userId = regRes.body.id;
    const loginRes = await request(app)
      .post('/api/users/login')
      .send({ email, password });
    token = loginRes.body.token;
  });

  it('should not reset password with expired token', async () => {
    // Insert an expired token manually
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();
    const expiredToken = 'expiredtoken123';
    await prisma.passwordResetToken.create({
      data: {
        token: expiredToken,
        userId,
        expiresAt: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago
      },
    });
    const res = await request(app)
      .post('/api/users/reset-password')
      .send({ token: expiredToken, newPassword: 'NewPass123!' });
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error');
    await prisma.$disconnect();
  });

  it('should not register invalid push token format', async () => {
    const res = await request(app)
      .post('/api/users/register-push-token')
      .set('Authorization', `Bearer ${token}`)
      .send({ pushToken: 'invalidtoken' });
    // The endpoint itself only checks for presence, but push send will fail on format
    // So, register works, but test-push will fail
    expect(res.statusCode).toBe(200);
    const pushRes = await request(app)
      .post('/api/users/test-push')
      .set('Authorization', `Bearer ${token}`)
      .send({ message: 'Should fail' });
    expect(pushRes.statusCode).toBe(400);
    expect(pushRes.body).toHaveProperty('error');
  });

  it('should update user profile', async () => {
    const newEmail = `updated_${Date.now()}@example.com`;
    const res = await request(app)
      .put('/api/users/me')
      .set('Authorization', `Bearer ${token}`)
      .send({ email: newEmail });
    expect(res.statusCode).toBe(200);
    expect(res.body.user).toHaveProperty('email', newEmail);
  });

  it('should change user password', async () => {
    const res = await request(app)
      .post('/api/users/change-password')
      .set('Authorization', `Bearer ${token}`)
      .send({ currentPassword: password, newPassword: 'Changed123!' });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message');
    // Login with new password
    const loginRes = await request(app)
      .post('/api/users/login')
      .send({ email, password: 'Changed123!' });
    expect(loginRes.statusCode).toBe(200);
    expect(loginRes.body).toHaveProperty('token');
  });

  it('should not change password with wrong current password', async () => {
    const res = await request(app)
      .post('/api/users/change-password')
      .set('Authorization', `Bearer ${token}`)
      .send({ currentPassword: 'WrongPass!', newPassword: 'NoChange123!' });
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  it('should not update profile without email', async () => {
    const res = await request(app)
      .put('/api/users/me')
      .set('Authorization', `Bearer ${token}`)
      .send({});
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  it('should not update profile without JWT', async () => {
    const res = await request(app)
      .put('/api/users/me')
      .send({ email: 'noauth@example.com' });
    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty('error');
  });

  it('should not change password without JWT', async () => {
    const res = await request(app)
      .post('/api/users/change-password')
      .send({ currentPassword: password, newPassword: 'NoAuth123!' });
    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty('error');
  });

  it('should fail Google social login with invalid token', async () => {
    const res = await request(app)
      .post('/api/users/social-login/google')
      .send({ idToken: 'invalidtoken' });
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error');
  });
});

describe('Email Verification', () => {
  const email = `verify_${Date.now()}@example.com`;
  const password = 'Test1234!';
  let token: string;
  let userId: string;

  beforeAll(async () => {
    jest.resetModules();
    jest.mock('../src/utils/mail', () => ({
      sendMail: jest.fn().mockResolvedValue(undefined),
    }));
    const regRes = await request(app)
      .post('/api/users/register')
      .send({ email, password });
    userId = regRes.body.id;
    const loginRes = await request(app)
      .post('/api/users/login')
      .send({ email, password });
    token = loginRes.body.token;
  });

  it('should request email verification', async () => {
    const res = await request(app)
      .post('/api/users/verify-email-request')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message');
  });

  it('should not request verification if already verified', async () => {
    // Manually set user as verified
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();
    await prisma.user.update({ where: { id: userId }, data: { emailVerified: true } });
    const res = await request(app)
      .post('/api/users/verify-email-request')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error');
    await prisma.$disconnect();
  });

  it('should verify email with valid token', async () => {
    // Set user as unverified and generate token
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();
    await prisma.user.update({ where: { id: userId }, data: { emailVerified: false } });
    await request(app)
      .post('/api/users/verify-email-request')
      .set('Authorization', `Bearer ${token}`);
    const user = await prisma.user.findUnique({ where: { id: userId } });
    const verifyToken = user.emailVerificationToken;
    const res = await request(app)
      .post('/api/users/verify-email')
      .send({ token: verifyToken });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message');
    await prisma.$disconnect();
  });

  it('should not verify with invalid token', async () => {
    const res = await request(app)
      .post('/api/users/verify-email')
      .send({ token: 'invalidtoken' });
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  it('should not verify with expired token', async () => {
    // Insert expired token
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();
    const expiredToken = 'expiredverifytoken';
    await prisma.user.update({
      where: { id: userId },
      data: {
        emailVerificationToken: expiredToken,
        emailVerificationTokenExpires: new Date(Date.now() - 60 * 60 * 1000),
      },
    });
    const res = await request(app)
      .post('/api/users/verify-email')
      .send({ token: expiredToken });
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error');
    await prisma.$disconnect();
  });
}); 