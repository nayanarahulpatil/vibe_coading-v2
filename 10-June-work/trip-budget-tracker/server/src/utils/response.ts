import type { Response } from 'express';

export interface ApiResponse<T = unknown> {
  status: number;
  data: T | null;
  message: string;
}

export const sendSuccess = <T>(res: Response, data: T, message = 'Success', status = 200) => {
  const body: ApiResponse<T> = { status, data, message };
  return res.status(status).json(body);
};

export const sendError = (res: Response, message: string, status = 400, data: unknown = null) => {
  const body: ApiResponse = { status, data, message };
  return res.status(status).json(body);
};
