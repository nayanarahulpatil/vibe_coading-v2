import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { env } from '../config/env.js';
import { resetTokenRepository, userRepository } from '../repositories/user.repository.js';
import { sendPasswordResetEmail } from './email.service.js';
import { generateToken, hashToken } from '../utils/tokens.js';
import type { AuthPayload } from '../middlewares/auth.js';

const SALT_ROUNDS = 10;

export const authService = {
  async register(email: string, password: string) {
    if (!email || !password) throw new Error('Email and password are required');
    if (password.length < 8) throw new Error('Password must be at least 8 characters');

    const existing = userRepository.findByEmail(email);
    if (existing) throw new Error('An account with this email already exists');

    const now = new Date().toISOString();
    const id = uuidv4();
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    userRepository.create(id, email, passwordHash, now);

    return { id, email: email.toLowerCase() };
  },

  async login(email: string, password: string) {
    const user = userRepository.findByEmail(email);
    if (!user) throw new Error('Invalid email or password');

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) throw new Error('Invalid email or password');

    const payload: AuthPayload = { userId: user.id, email: user.email };
    const token = jwt.sign(payload, env.jwtSecret, { expiresIn: env.jwtExpiresIn });

    return { token, user: { id: user.id, email: user.email } };
  },

  getMe(userId: string) {
    const user = userRepository.findById(userId);
    if (!user) throw new Error('User not found');
    return { id: user.id, email: user.email };
  },

  async forgotPassword(email: string, origin: string) {
    const user = userRepository.findByEmail(email);
    let resetUrl: string | undefined;

    if (user) {
      const rawToken = generateToken();
      const tokenHash = hashToken(rawToken);
      const expiresAt = new Date(Date.now() + env.resetTokenTtlMs).toISOString();
      resetTokenRepository.create(uuidv4(), user.id, tokenHash, expiresAt);
      resetUrl = `${origin}/reset-password?token=${rawToken}`;
      await sendPasswordResetEmail(user.email, resetUrl);
    }

    return {
      message: 'If an account exists for that email, a reset link has been sent.',
      ...(env.devReturnResetLink && resetUrl ? { devResetUrl: resetUrl } : {}),
    };
  },

  async resetPassword(token: string, password: string) {
    if (!token || !password) throw new Error('Token and password are required');
    if (password.length < 8) throw new Error('Password must be at least 8 characters');

    const tokenHash = hashToken(token);
    const record = resetTokenRepository.findByTokenHash(tokenHash);
    if (!record) throw new Error('Reset link expired or invalid');

    if (new Date(record.expires_at).getTime() < Date.now()) {
      throw new Error('Reset link expired or invalid');
    }

    const now = new Date().toISOString();
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    userRepository.updatePassword(record.user_id, passwordHash, now);
    resetTokenRepository.markUsed(record.id, now);
  },
};
