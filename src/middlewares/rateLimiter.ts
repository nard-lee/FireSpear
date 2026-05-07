import rateLimit from 'express-rate-limit';
import { Request, Response } from 'express';

const rateLimitHandler = (message: string) => (req: Request, res: Response) => {
  return res.status(429).json({
    errors: {
      general: [message]
    }
  });
};

// General auth actions (register, login)
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  handler: rateLimitHandler('Too many attempts. Please try again later.')
});

// Password reset requests — stricter, less frequent
export const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  handler: rateLimitHandler('Too many password reset requests. Please try again in an hour.')
});

// Email verification resend
export const emailVerificationLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 3,
  standardHeaders: true,
  legacyHeaders: false,
  handler: rateLimitHandler('Too many verification emails sent. Please try again in an hour.')
});

// Sensitive actions (e.g. changing email, 2FA)
export const sensitiveActionLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  handler: rateLimitHandler('Too many attempts on a sensitive action. Please try again later.')
});