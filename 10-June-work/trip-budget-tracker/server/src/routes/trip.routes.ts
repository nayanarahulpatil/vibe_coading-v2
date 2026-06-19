import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { authMiddleware } from '../middlewares/auth.js';
import { tripService } from '../services/trip.service.js';
import { sendError, sendSuccess } from '../utils/response.js';
import { env } from '../config/env.js';

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, env.uploadsDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname) || '.jpg';
    cb(null, `${uuidv4()}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/heic', 'image/heif'];
    const ext = path.extname(file.originalname).toLowerCase();
    const allowedExt = ['.jpg', '.jpeg', '.png', '.heic', '.heif'];
    if (allowed.includes(file.mimetype) || allowedExt.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file format. Accepts JPEG, PNG, HEIC.'));
    }
  },
});

export const tripRoutes = Router();

tripRoutes.use(authMiddleware);

tripRoutes.get('/', (req, res, next) => {
  try {
    const trips = tripService.listTrips(req.user!.userId);
    return sendSuccess(res, trips, 'Trips retrieved');
  } catch (err) {
    next(err);
  }
});

tripRoutes.get('/:tripId', (req, res, next) => {
  try {
    const trip = tripService.getTrip(req.user!.userId, req.params.tripId);
    return sendSuccess(res, trip, 'Trip retrieved');
  } catch (err) {
    next(err);
  }
});

tripRoutes.post('/', (req, res, next) => {
  try {
    const { title, baseCurrency } = req.body as { title?: string; baseCurrency?: string };
    const trip = tripService.createTrip(req.user!.userId, title ?? '', baseCurrency ?? 'USD');
    return sendSuccess(res, trip, 'Trip created', 201);
  } catch (err) {
    next(err);
  }
});

tripRoutes.post('/:tripId/members', (req, res, next) => {
  try {
    const { name, upiId, paypalUsername } = req.body as {
      name?: string;
      upiId?: string;
      paypalUsername?: string;
    };
    const member = tripService.addMember(
      req.user!.userId,
      req.params.tripId,
      name ?? '',
      upiId,
      paypalUsername
    );
    return sendSuccess(res, member, 'Member added', 201);
  } catch (err) {
    next(err);
  }
});

tripRoutes.post('/:tripId/expenses', upload.single('receipt'), (req, res, next) => {
  try {
    const body = req.body as Record<string, string>;
    const receiptPath = req.file ? path.join(env.uploadsDir, req.file.filename) : null;

    const expense = tripService.addExpense(req.user!.userId, req.params.tripId, {
      payerId: body.payerId,
      amountOriginal: Number(body.amountOriginal),
      currency: body.currency,
      amountBase: Number(body.amountBase),
      fxRate: Number(body.fxRate),
      category: body.category,
      description: body.description,
      receiptPhotoPath: receiptPath,
      isOfflineRate: body.isOfflineRate === 'true',
      rateFetchedAt: body.rateFetchedAt || null,
      expenseDate: body.expenseDate || new Date().toISOString(),
    });

    return sendSuccess(res, expense, 'Expense added', 201);
  } catch (err) {
    next(err);
  }
});

export const receiptRoutes = Router();

receiptRoutes.get('/:expenseId', authMiddleware, (req, res, next) => {
  try {
    const { path: filePath } = tripService.getReceiptForExpense(
      req.user!.userId,
      req.params.expenseId
    );
    if (!fs.existsSync(filePath)) {
      return sendError(res, 'Receipt file not found', 404);
    }
    return res.sendFile(path.resolve(filePath));
  } catch (err) {
    next(err);
  }
});
