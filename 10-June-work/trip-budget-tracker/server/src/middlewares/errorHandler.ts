import type { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/response.js';

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  console.error(err);
  const message = err.message || 'Internal server error';

  const clientErrors = [
    'already exists',
    'required',
    'Invalid',
    'must be',
    'expired',
    'not found',
    'Forbidden',
    'format',
  ];

  let status = 500;
  if (message.includes('Forbidden')) status = 403;
  else if (message.includes('not found')) status = 404;
  else if (message.includes('Invalid email or password')) status = 401;
  else if (clientErrors.some((k) => message.includes(k))) status = 400;

  return sendError(res, message, status);
};
