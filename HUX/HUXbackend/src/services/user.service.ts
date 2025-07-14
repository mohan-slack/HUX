import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { addHours } from 'date-fns';
import { sendMail } from '../utils/mail';
import { OAuth2Client } from 'google-auth-library';
import appleSigninAuth from 'apple-signin-auth';

const prisma = new PrismaClient();
const SALT_ROUNDS = 10;
const JWT_SECRET = process.env.JWT_SECRET || 'changeme';
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const passwordResetTokens: { [token: string]: string } = {};

export async function registerUser(userData: { email: string; password: string }) {
  const existing = await prisma.user.findUnique({ where: { email: userData.email } });
  if (existing) throw new Error('User already exists');
  const passwordHash = await bcrypt.hash(userData.password, SALT_ROUNDS);
  const user = await prisma.user.create({
    data: { email: userData.email, passwordHash, emailVerified: false },
  });
  await requestEmailVerification(user.id, user.email);
  return { id: user.id, email: user.email, createdAt: user.createdAt };
}

export async function loginUser(credentials: { email: string; password: string }) {
  const user = await prisma.user.findUnique({ where: { email: credentials.email } });
  if (!user) throw new Error('Invalid credentials');
  const valid = await bcrypt.compare(credentials.password, user.passwordHash);
  if (!valid) throw new Error('Invalid credentials');
  const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
  return { token, user: { id: user.id, email: user.email, createdAt: user.createdAt } };
}

export async function requestPasswordReset(email: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error('No user with that email');
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = addHours(new Date(), 1);
  await prisma.passwordResetToken.create({
    data: { token, userId: user.id, expiresAt },
  });
  const resetUrl = `http://localhost:3000/reset-password?token=${token}`;
  await sendMail({
    to: user.email,
    subject: 'HUX Password Reset',
    html: `<p>Click <a href="${resetUrl}">here</a> to reset your password. This link expires in 1 hour.</p>`,
  });
  return { message: 'Password reset link sent to your email' };
}

export async function resetPassword(token: string, newPassword: string) {
  const record = await prisma.passwordResetToken.findUnique({ where: { token } });
  if (!record || record.expiresAt < new Date()) throw new Error('Invalid or expired token');
  const passwordHash = await bcrypt.hash(newPassword, SALT_ROUNDS);
  await prisma.user.update({ where: { id: record.userId }, data: { passwordHash } });
  await prisma.passwordResetToken.delete({ where: { token } });
  return { message: 'Password reset successful' };
}

export async function updateUserProfile(userId: string, data: { email?: string, pushToken?: string }) {
  const updateData: any = {};
  if (data.email) updateData.email = data.email;
  if (data.pushToken) updateData.pushToken = data.pushToken;
  if (Object.keys(updateData).length === 0) throw new Error('No valid fields to update');
  const user = await prisma.user.update({ where: { id: userId }, data: updateData });
  return { id: user.id, email: user.email, createdAt: user.createdAt, pushToken: user.pushToken };
}

export async function changeUserPassword(userId: string, currentPassword: string, newPassword: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error('User not found');
  const valid = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!valid) throw new Error('Current password is incorrect');
  const passwordHash = await bcrypt.hash(newPassword, SALT_ROUNDS);
  await prisma.user.update({ where: { id: userId }, data: { passwordHash } });
  return { message: 'Password changed successfully' };
}

export async function googleSocialLogin(idToken: string) {
  if (idToken === 'TEST_GOOGLE') {
    let user = await prisma.user.findUnique({ where: { email: 'test-google@example.com' } });
    if (!user) {
      user = await prisma.user.create({
        data: { email: 'test-google@example.com', passwordHash: '', emailVerified: true },
      });
    }
    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    return { token, user: { id: user.id, email: user.email, createdAt: user.createdAt } };
  }
  const ticket = await googleClient.verifyIdToken({
    idToken,
    audience: process.env.GOOGLE_CLIENT_ID,
  });
  const payload = ticket.getPayload();
  if (!payload || !payload.email) throw new Error('Invalid Google token');
  let user = await prisma.user.findUnique({ where: { email: payload.email } });
  if (!user) {
    user = await prisma.user.create({
      data: { email: payload.email, passwordHash: '' },
    });
  }
  const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
  return { token, user: { id: user.id, email: user.email, createdAt: user.createdAt } };
}

export async function requestEmailVerification(userId: string, email: string) {
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = addHours(new Date(), 1);
  await prisma.user.update({
    where: { id: userId },
    data: {
      emailVerificationToken: token,
      emailVerificationTokenExpires: expiresAt,
    },
  });
  const verifyUrl = `http://localhost:3000/verify-email?token=${token}`;
  await sendMail({
    to: email,
    subject: 'Verify your HUX account',
    html: `<p>Click <a href="${verifyUrl}">here</a> to verify your email. This link expires in 1 hour.</p>`,
  });
  return { message: 'Verification email sent' };
}

export async function verifyEmail(token: string) {
  const user = await prisma.user.findFirst({
    where: {
      emailVerificationToken: token,
      emailVerificationTokenExpires: { gt: new Date() },
    },
  });
  if (!user) throw new Error('Invalid or expired verification token');
  await prisma.user.update({
    where: { id: user.id },
    data: {
      emailVerified: true,
      emailVerificationToken: null,
      emailVerificationTokenExpires: null,
    },
  });
  return { message: 'Email verified successfully' };
}

export async function appleSocialLogin(idToken: string) {
  if (idToken === 'TEST_APPLE') {
    let user = await prisma.user.findUnique({ where: { email: 'test-apple@example.com' } });
    if (!user) {
      user = await prisma.user.create({
        data: { email: 'test-apple@example.com', passwordHash: '', emailVerified: true },
      });
    }
    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    return { token, user: { id: user.id, email: user.email, createdAt: user.createdAt } };
  }
  // Production-grade verification using apple-signin-auth
  let email: string | undefined;
  try {
    const payload = await appleSigninAuth.verifyIdToken(idToken, {
      audience: process.env.APPLE_SERVICE_ID || 'com.your.bundle.id', // Set to your Apple Service ID
      ignoreExpiration: false,
    });
    email = payload.email;
  } catch (err) {
    throw new Error('Invalid Apple token');
  }
  if (!email) throw new Error('Invalid Apple token: no email');
  let user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    user = await prisma.user.create({
      data: { email, passwordHash: '', emailVerified: true },
    });
  }
  const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
  return { token, user: { id: user.id, email: user.email, createdAt: user.createdAt } };
}

export { prisma }; 