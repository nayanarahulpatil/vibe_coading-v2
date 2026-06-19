import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { authService } from '../services/auth.service.js';
import { authMiddleware } from '../middlewares/auth.js';
import { sendError, sendSuccess } from '../utils/response.js';
import { env } from '../config/env.js';

const limiterSkip = () => env.disableRateLimit;

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: 'Too many requests',
  skip: limiterSkip,
});
const resetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: 'Too many reset requests',
  skip: limiterSkip,
});

export const authRoutes = Router();

authRoutes.post('/register', authLimiter, async (req, res, next) => {
  try {
    const { email, password } = req.body as { email?: string; password?: string };
    const user = await authService.register(email ?? '', password ?? '');
    return sendSuccess(res, user, 'Account created successfully', 201);
  } catch (err) {
    next(err);
  }
});

authRoutes.post('/login', authLimiter, async (req, res, next) => {
  try {
    const { email, password } = req.body as { email?: string; password?: string };
    const result = await authService.login(email ?? '', password ?? '');
    return sendSuccess(res, result, 'Login successful');
  } catch (err) {
    if (err instanceof Error && err.message === 'Invalid email or password') {
      return sendError(res, err.message, 401);
    }
    next(err);
  }
});

authRoutes.get('/me', authMiddleware, (req, res, next) => {
  try {
    const user = authService.getMe(req.user!.userId);
    return sendSuccess(res, user, 'User profile');
  } catch (err) {
    next(err);
  }
});

authRoutes.post('/logout', authMiddleware, (_req, res) => {
  return sendSuccess(res, null, 'Logged out successfully');
});

authRoutes.post('/forgot-password', resetLimiter, async (req, res, next) => {
  try {
    const { email } = req.body as { email?: string };
    const origin = (req.headers.origin as string) || env.clientOrigin;
    const result = await authService.forgotPassword(email ?? '', origin);
    return sendSuccess(res, result, result.message);
  } catch (err) {
    next(err);
  }
});

authRoutes.post('/reset-password', resetLimiter, async (req, res, next) => {
  try {
    const { token, password } = req.body as { token?: string; password?: string };
    await authService.resetPassword(token ?? '', password ?? '');
    return sendSuccess(res, null, 'Password reset successful');
  } catch (err) {
    next(err);
  }
});
