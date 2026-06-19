export const env = {
  port: Number(process.env.PORT) || 3001,
  jwtSecret: process.env.JWT_SECRET || 'dev-trip-budget-tracker-secret-change-in-production',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '24h',
  resetTokenTtlMs: Number(process.env.RESET_TOKEN_TTL_MS) || 60 * 60 * 1000,
  dbPath: process.env.DB_PATH || 'data/trip_budget.db',
  uploadsDir: process.env.UPLOADS_DIR || 'uploads',
  fxApiUrl: process.env.FX_API_URL || 'https://open.er-api.com/v6/latest',
  clientOrigin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  disableRateLimit: process.env.DISABLE_RATE_LIMIT === 'true',
  /** In dev, return reset URL in API response (no real email sent). Never enable in production. */
  devReturnResetLink: process.env.NODE_ENV !== 'production',
};
