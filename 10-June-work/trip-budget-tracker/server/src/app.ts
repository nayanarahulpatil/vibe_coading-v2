import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import './database/db.js';
import { env } from './config/env.js';
import { authRoutes } from './routes/auth.routes.js';
import { tripRoutes, receiptRoutes } from './routes/trip.routes.js';
import { fxRoutes } from './routes/fx.routes.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { sendError } from './utils/response.js';

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: env.clientOrigin,
    credentials: true,
  })
);
app.use(express.json({ limit: '1mb' }));

app.get('/health', (_req, res) => {
  res.json({ status: 200, data: { ok: true }, message: 'OK' });
});

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/trips', tripRoutes);
app.use('/api/v1/fx', fxRoutes);
app.use('/api/v1/receipts', receiptRoutes);

app.use((_req, res) => sendError(res, 'Not found', 404));

app.use(errorHandler);

app.listen(env.port, () => {
  console.log(`Trip Budget Tracker API v3 running on http://localhost:${env.port}`);
});
