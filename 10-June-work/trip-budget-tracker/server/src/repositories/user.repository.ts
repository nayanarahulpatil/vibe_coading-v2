import { db } from '../database/db.js';

export interface UserRow {
  id: string;
  email: string;
  password_hash: string;
  created_at: string;
  updated_at: string;
}

export const userRepository = {
  findByEmail(email: string): UserRow | undefined {
    return db.prepare('SELECT * FROM users WHERE email = ?').get(email.toLowerCase()) as UserRow | undefined;
  },

  findById(id: string): UserRow | undefined {
    return db.prepare('SELECT * FROM users WHERE id = ?').get(id) as UserRow | undefined;
  },

  create(id: string, email: string, passwordHash: string, now: string) {
    db.prepare(
      'INSERT INTO users (id, email, password_hash, created_at, updated_at) VALUES (?, ?, ?, ?, ?)'
    ).run(id, email.toLowerCase(), passwordHash, now, now);
  },

  updatePassword(userId: string, passwordHash: string, now: string) {
    db.prepare('UPDATE users SET password_hash = ?, updated_at = ? WHERE id = ?').run(
      passwordHash,
      now,
      userId
    );
  },
};

export const resetTokenRepository = {
  create(id: string, userId: string, tokenHash: string, expiresAt: string) {
    db.prepare(
      'INSERT INTO password_reset_tokens (id, user_id, token_hash, expires_at) VALUES (?, ?, ?, ?)'
    ).run(id, userId, tokenHash, expiresAt);
  },

  findByTokenHash(tokenHash: string) {
    return db
      .prepare('SELECT * FROM password_reset_tokens WHERE token_hash = ? AND used_at IS NULL')
      .get(tokenHash) as
      | { id: string; user_id: string; token_hash: string; expires_at: string; used_at: string | null }
      | undefined;
  },

  markUsed(id: string, usedAt: string) {
    db.prepare('UPDATE password_reset_tokens SET used_at = ? WHERE id = ?').run(usedAt, id);
  },
};
