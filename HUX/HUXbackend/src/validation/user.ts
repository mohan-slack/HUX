import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, 'Password required'),
});

export const resetPasswordRequestSchema = z.object({
  email: z.string().email(),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Token required'),
  newPassword: z.string().min(8, 'Password must be at least 8 characters'),
});

export const updateProfileSchema = z.object({
  email: z.string().email(),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password required'),
  newPassword: z.string().min(8, 'Password must be at least 8 characters'),
});

export const googleSocialLoginSchema = z.object({
  idToken: z.string().min(1, 'idToken required'),
});

export const appleSocialLoginSchema = z.object({
  idToken: z.string().min(1, 'idToken required'),
});

export const pushTokenSchema = z.object({
  pushToken: z.string().min(1, 'pushToken required'),
});

export const verifyEmailSchema = z.object({
  token: z.string().min(1, 'Token required'),
}); 