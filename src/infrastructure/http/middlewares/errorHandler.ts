import { Request, Response, NextFunction } from 'express';
import { errorResponse } from '../../../shared/utils/responses';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('Error:', err);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  return res.status(statusCode).json(
    errorResponse(statusCode, message, err.details)
  );
};
