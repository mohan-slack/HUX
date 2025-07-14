import { Router, Request, Response } from 'express';
import { registerUser, loginUser, requestPasswordReset, resetPassword, updateUserProfile, changeUserPassword, googleSocialLogin, requestEmailVerification, verifyEmail, appleSocialLogin } from '../../services/user.service';
import { authenticateJWT, AuthRequest, requireVerifiedEmail } from '../middlewares/auth.middleware';
import { sendPushNotification } from '../../utils/push';
import {
  registerSchema,
  loginSchema,
  resetPasswordRequestSchema,
  resetPasswordSchema,
  updateProfileSchema,
  changePasswordSchema,
  googleSocialLoginSchema,
  pushTokenSchema,
  verifyEmailSchema,
  appleSocialLoginSchema,
} from '../../validation/user';

const router = Router();

/**
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User registered
 *         content:
 *           application/json:
 *             examples:
 *               success:
 *                 value:
 *                   id: "user-id"
 *                   email: "user@example.com"
 *                   createdAt: "2024-06-01T12:00:00.000Z"
 *       400:
 *         description: Error
 *         content:
 *           application/json:
 *             examples:
 *               error:
 *                 value:
 *                   error: "User already exists"
 */
router.post('/register', async (req: Request, res: Response) => {
  const parse = registerSchema.safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({ error: parse.error.errors.map(e => e.message).join(', ') });
  }
  const { email, password } = parse.data;
  try {
    const user = await registerUser({ email, password });
    res.json(user);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Login with email and password
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: JWT and user info
 *         content:
 *           application/json:
 *             examples:
 *               success:
 *                 value:
 *                   token: "jwt-token"
 *                   user:
 *                     id: "user-id"
 *                     email: "user@example.com"
 *                     createdAt: "2024-06-01T12:00:00.000Z"
 *       400:
 *         description: Error
 *         content:
 *           application/json:
 *             examples:
 *               error:
 *                 value:
 *                   error: "Invalid credentials"
 */
router.post('/login', async (req: Request, res: Response) => {
  const parse = loginSchema.safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({ error: parse.error.errors.map(e => e.message).join(', ') });
  }
  const { email, password } = parse.data;
  try {
    const result = await loginUser({ email, password });
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * @swagger
 * /api/users/me:
 *   get:
 *     summary: Get current user profile
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User info
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *             examples:
 *               success:
 *                 value:
 *                   user:
 *                     id: "user-id"
 *                     email: "user@example.com"
 *                     createdAt: "2024-06-01T12:00:00.000Z"
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               error:
 *                 value:
 *                   error: "Unauthorized"
 */
router.get('/me', authenticateJWT, requireVerifiedEmail, (req: AuthRequest, res: Response) => {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
  res.json({ user: req.user });
});

/**
 * @swagger
 * /api/users/reset-password-request:
 *   post:
 *     summary: Request password reset
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Reset link sent
 *         content:
 *           application/json:
 *             examples:
 *               success:
 *                 value:
 *                   message: "Password reset link sent to your email"
 *       400:
 *         description: Error
 *         content:
 *           application/json:
 *             examples:
 *               error:
 *                 value:
 *                   error: "No user with that email"
 */
router.post('/reset-password-request', async (req: Request, res: Response) => {
  const parse = resetPasswordRequestSchema.safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({ error: parse.error.errors.map(e => e.message).join(', ') });
  }
  const { email } = parse.data;
  try {
    const result = await requestPasswordReset(email);
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * @swagger
 * /api/users/reset-password:
 *   post:
 *     summary: Reset password with token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password reset
 *         content:
 *           application/json:
 *             examples:
 *               success:
 *                 value:
 *                   message: "Password reset successful"
 *       400:
 *         description: Error
 *         content:
 *           application/json:
 *             examples:
 *               error:
 *                 value:
 *                   error: "Invalid or expired token"
 */
router.post('/reset-password', async (req: Request, res: Response) => {
  const parse = resetPasswordSchema.safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({ error: parse.error.errors.map(e => e.message).join(', ') });
  }
  const { token, newPassword } = parse.data;
  try {
    const result = await resetPassword(token, newPassword);
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * @swagger
 * /api/users/me:
 *   put:
 *     summary: Update user profile
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Updated user info
 *         content:
 *           application/json:
 *             examples:
 *               success:
 *                 value:
 *                   user:
 *                     id: "user-id"
 *                     email: "newemail@example.com"
 *                     createdAt: "2024-06-01T12:00:00.000Z"
 *       400:
 *         description: Error
 *         content:
 *           application/json:
 *             examples:
 *               error:
 *                 value:
 *                   error: "Email required"
 */
router.put('/me', authenticateJWT, requireVerifiedEmail, async (req: AuthRequest, res: Response) => {
  const parse = updateProfileSchema.safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({ error: parse.error.errors.map(e => e.message).join(', ') });
  }
  const { email } = parse.data;
  try {
    const user = await updateUserProfile(req.user.userId || req.user.id, { email });
    res.json({ user });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * @swagger
 * /api/users/change-password:
 *   post:
 *     summary: Change user password
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               currentPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password changed
 *         content:
 *           application/json:
 *             examples:
 *               success:
 *                 value:
 *                   message: "Password changed successfully"
 *       400:
 *         description: Error
 *         content:
 *           application/json:
 *             examples:
 *               error:
 *                 value:
 *                   error: "Current password is incorrect"
 */
router.post('/change-password', authenticateJWT, requireVerifiedEmail, async (req: AuthRequest, res: Response) => {
  const parse = changePasswordSchema.safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({ error: parse.error.errors.map(e => e.message).join(', ') });
  }
  const { currentPassword, newPassword } = parse.data;
  try {
    await changeUserPassword(req.user.userId || req.user.id, currentPassword, newPassword);
    res.json({ message: 'Password changed successfully' });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * @swagger
 * /api/users/social-login/google:
 *   post:
 *     summary: Login or register with Google
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               idToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: JWT and user info
 *         content:
 *           application/json:
 *             examples:
 *               success:
 *                 value:
 *                   token: "jwt-token"
 *                   user:
 *                     id: "user-id"
 *                     email: "user@example.com"
 *                     createdAt: "2024-06-01T12:00:00.000Z"
 *       400:
 *         description: Error
 *         content:
 *           application/json:
 *             examples:
 *               error:
 *                 value:
 *                   error: "Invalid Google token"
 */
router.post('/social-login/google', async (req: Request, res: Response) => {
  const parse = googleSocialLoginSchema.safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({ error: parse.error.errors.map(e => e.message).join(', ') });
  }
  const { idToken } = parse.data;
  try {
    const result = await googleSocialLogin(idToken);
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * @swagger
 * /api/users/social-login/apple:
 *   post:
 *     summary: Login or register with Apple
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               idToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: JWT and user info
 *         content:
 *           application/json:
 *             examples:
 *               success:
 *                 value:
 *                   token: "jwt-token"
 *                   user:
 *                     id: "user-id"
 *                     email: "user@example.com"
 *                     createdAt: "2024-06-01T12:00:00.000Z"
 *       400:
 *         description: Error
 *         content:
 *           application/json:
 *             examples:
 *               error:
 *                 value:
 *                   error: "Invalid Apple token"
 */
router.post('/social-login/apple', async (req: Request, res: Response) => {
  const parse = appleSocialLoginSchema.safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({ error: parse.error.errors.map(e => e.message).join(', ') });
  }
  const { idToken } = parse.data;
  try {
    const result = await appleSocialLogin(idToken);
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * @swagger
 * /api/users/register-push-token:
 *   post:
 *     summary: Register Expo push token
 *     tags: [Push]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               pushToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Push token registered
 *         content:
 *           application/json:
 *             examples:
 *               success:
 *                 value:
 *                   message: "Push token registered"
 *       400:
 *         description: Error
 *         content:
 *           application/json:
 *             examples:
 *               error:
 *                 value:
 *                   error: "pushToken required"
 */
router.post('/register-push-token', authenticateJWT, requireVerifiedEmail, async (req: AuthRequest, res: Response) => {
  const parse = pushTokenSchema.safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({ error: parse.error.errors.map(e => e.message).join(', ') });
  }
  const { pushToken } = parse.data;
  try {
    await updateUserProfile(req.user.userId || req.user.id, { pushToken });
    res.json({ message: 'Push token registered' });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * @swagger
 * /api/users/test-push:
 *   post:
 *     summary: Send a test push notification
 *     tags: [Push]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *     responses:
 *       200:
 *         description: Push notification sent
 *         content:
 *           application/json:
 *             examples:
 *               success:
 *                 value:
 *                   message: "Push notification sent"
 *       400:
 *         description: Error
 *         content:
 *           application/json:
 *             examples:
 *               error:
 *                 value:
 *                   error: "No push token registered for user"
 */
router.post('/test-push', authenticateJWT, requireVerifiedEmail, async (req: AuthRequest, res: Response) => {
  try {
    const { message } = req.body;
    const userId = req.user.userId || req.user.id;
    const user = await (await import('../../services/user.service')).prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.pushToken) return res.status(400).json({ error: 'No push token registered for user' });
    await sendPushNotification(user.pushToken, 'Test Notification', message || 'This is a test push notification from HUX!');
    res.json({ message: 'Push notification sent' });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: List all users (admin/demo)
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *             examples:
 *               success:
 *                 value:
 *                   - id: "user-id-1"
 *                     email: "user1@example.com"
 *                     createdAt: "2024-06-01T12:00:00.000Z"
 *                   - id: "user-id-2"
 *                     email: "user2@example.com"
 *                     createdAt: "2024-06-01T12:00:00.000Z"
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               error:
 *                 value:
 *                   error: "Unauthorized"
 */
router.get('/', authenticateJWT, requireVerifiedEmail, async (req: AuthRequest, res: Response) => {
  // For demo: list all users (in production, restrict to admin)
  try {
    const users = await (await import('../../services/user.service')).prisma.user.findMany({
      select: { id: true, email: true, createdAt: true },
    });
    res.json(users);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Get user by ID (admin)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID
 *     responses:
 *       200:
 *         description: User info
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *             examples:
 *               success:
 *                 value:
 *                   id: "user-id"
 *                   email: "user@example.com"
 *                   createdAt: "2024-06-01T12:00:00.000Z"
 *       404:
 *         description: Not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               error:
 *                 value:
 *                   error: "User not found"
 */
router.get('/:id', authenticateJWT, requireVerifiedEmail, async (req: AuthRequest, res: Response) => {
  // In production, check admin role
  try {
    const user = await (await import('../../services/user.service')).prisma.user.findUnique({
      where: { id: req.params.id },
      select: { id: true, email: true, createdAt: true },
    });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /api/analytics/user-count:
 *   get:
 *     summary: Get total user count
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User count
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: integer
 *                   example: 42
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               error:
 *                 value:
 *                   error: "Unauthorized"
 */
router.get('/analytics/user-count', authenticateJWT, requireVerifiedEmail, async (req: AuthRequest, res: Response) => {
  // In production, check admin role
  try {
    const count = await (await import('../../services/user.service')).prisma.user.count();
    res.json({ count });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * components:
 *   schemas:
 *     AnalyticsSummary:
 *       type: object
 *       properties:
 *         userCount:
 *           type: integer
 *           example: 100
 *         activeUsers:
 *           type: integer
 *           example: 80
 *         newUsers:
 *           type: integer
 *           example: 5
 */
/**
 * @swagger
 * /api/analytics/summary:
 *   get:
 *     summary: Get analytics summary
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Analytics summary
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AnalyticsSummary'
 *             examples:
 *               success:
 *                 value:
 *                   userCount: 100
 *                   activeUsers: 80
 *                   newUsers: 5
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               error:
 *                 value:
 *                   error: "Unauthorized"
 */
router.get('/analytics/summary', authenticateJWT, requireVerifiedEmail, async (req: AuthRequest, res: Response) => {
  // In production, check admin role
  try {
    // For demo, use fake numbers
    const userCount = await (await import('../../services/user.service')).prisma.user.count();
    const activeUsers = Math.floor(userCount * 0.8);
    const newUsers = Math.floor(userCount * 0.05);
    res.json({ userCount, activeUsers, newUsers });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /api/analytics/registrations-by-day:
 *   get:
 *     summary: Get user registration counts by day (last 7 days)
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Registration counts by day
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   date:
 *                     type: string
 *                     format: date
 *                   count:
 *                     type: integer
 *             examples:
 *               success:
 *                 value:
 *                   - date: "2024-05-25"
 *                     count: 2
 *                   - date: "2024-05-26"
 *                     count: 3
 *                   - date: "2024-05-27"
 *                     count: 1
 *                   - date: "2024-05-28"
 *                     count: 0
 *                   - date: "2024-05-29"
 *                     count: 4
 *                   - date: "2024-05-30"
 *                     count: 2
 *                   - date: "2024-05-31"
 *                     count: 5
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               error:
 *                 value:
 *                   error: "Unauthorized"
 */
router.get('/analytics/registrations-by-day', authenticateJWT, requireVerifiedEmail, async (req: AuthRequest, res: Response) => {
  // In production, check admin role
  try {
    const prisma = (await import('../../services/user.service')).prisma;
    const days = 7;
    const today = new Date();
    const results = [];
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const start = new Date(date);
      start.setHours(0, 0, 0, 0);
      const end = new Date(date);
      end.setHours(23, 59, 59, 999);
      const count = await prisma.user.count({
        where: {
          createdAt: {
            gte: start,
            lte: end,
          },
        },
      });
      results.push({ date: start.toISOString().slice(0, 10), count });
    }
    res.json(results);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /api/analytics/active-vs-inactive:
 *   get:
 *     summary: Get counts of active vs inactive users (demo)
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Active vs inactive user counts
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 active:
 *                   type: integer
 *                   example: 80
 *                 inactive:
 *                   type: integer
 *                   example: 20
 *             examples:
 *               success:
 *                 value:
 *                   active: 80
 *                   inactive: 20
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             examples:
 *               error:
 *                 value:
 *                   error: "Unauthorized"
 */
router.get('/analytics/active-vs-inactive', authenticateJWT, requireVerifiedEmail, async (req: AuthRequest, res: Response) => {
  // In production, check admin role
  try {
    const prisma = (await import('../../services/user.service')).prisma;
    const total = await prisma.user.count();
    // Demo: random split
    const active = Math.floor(total * 0.8);
    const inactive = total - active;
    res.json({ active, inactive });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /api/users/verify-email-request:
 *   post:
 *     summary: Request email verification
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Verification email sent
 *         content:
 *           application/json:
 *             examples:
 *               success:
 *                 value:
 *                   message: "Verification email sent"
 *       400:
 *         description: Error
 *         content:
 *           application/json:
 *             examples:
 *               error:
 *                 value:
 *                   error: "Already verified"
 */
router.post('/verify-email-request', authenticateJWT, async (req: AuthRequest, res: Response) => {
  try {
    if (req.user.emailVerified) return res.status(400).json({ error: 'Already verified' });
    const result = await requestEmailVerification(req.user.userId || req.user.id, req.user.email);
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * @swagger
 * /api/users/verify-email:
 *   post:
 *     summary: Verify email with token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *     responses:
 *       200:
 *         description: Email verified
 *         content:
 *           application/json:
 *             examples:
 *               success:
 *                 value:
 *                   message: "Email verified successfully"
 *       400:
 *         description: Error
 *         content:
 *           application/json:
 *             examples:
 *               error:
 *                 value:
 *                   error: "Invalid or expired verification token"
 */
router.post('/verify-email', async (req: Request, res: Response) => {
  const parse = verifyEmailSchema.safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({ error: parse.error.errors.map(e => e.message).join(', ') });
  }
  const { token } = parse.data;
  try {
    const result = await verifyEmail(token);
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

export default router; 