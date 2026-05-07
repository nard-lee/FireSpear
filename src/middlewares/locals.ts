import { Request, Response, NextFunction } from 'express';
import { generateToken } from '../lib/csrf.js';

export const locals = (req: Request, res: Response, next: NextFunction): void => {
  res.locals.userId = req.session.userId || null;
  res.locals.user = req.session.user || null;
  res.locals.csrfToken = generateToken(req);
  res.locals.path = req.path;
  next();
};