import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.js';
import { fxService } from '../services/fx.service.js';
import { sendSuccess } from '../utils/response.js';

export const fxRoutes = Router();

fxRoutes.get('/rates/:baseCurrency', authMiddleware, async (req, res, next) => {
  try {
    const refresh = req.query.refresh === 'true';
    const rates = refresh
      ? await fxService.refreshRates(req.params.baseCurrency)
      : await fxService.getRates(req.params.baseCurrency);
    return sendSuccess(res, rates, 'FX rates retrieved');
  } catch (err) {
    next(err);
  }
});
