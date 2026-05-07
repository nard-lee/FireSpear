import { Request, Response, NextFunction } from 'express';
import { config } from '../config/index.js';

export interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

export const errorHandler = (err: AppError & { code?: string }, req: Request, res: Response, _next: NextFunction): void => {
  if (err.code === 'EBADCSRFTOKEN' || err.statusCode === 403) {
    res.status(403).render('error/403', {
      title: '403 Forbidden',
      message: 'Invalid or expired form submission. Please go back and try again.',
      layout: 'layouts/layout',
    });
    return;
  }

  const statusCode = err.statusCode || 500;

  if (err.isOperational) {
    res.status(statusCode).render('err/error', {
      title: `${statusCode} Error`,
      message: err.message,
      layout: 'layouts/layout',
    });
    return;
  }

  console.error('[Unhandled Error]', err);
  res.status(500).render('error/500', {
    title: '500 Internal Server Error',
    message:
      config.nodeEnv === 'development'
        ? err.message
        : 'Something went wrong. Please try again later.',
    stack: config.nodeEnv === 'development' ? err.stack : undefined,
    layout: 'layouts/layout',
  });
};

export const notFound = (req: Request, res: Response): void => {
  res.status(404).render('error/404', {
    title: '404 Not Found',
    url: req.originalUrl,
    layout: 'layouts/layout',
  });
};