import { Router } from 'express';
import passport from 'passport';

import { validate } from '../../middlewares/validate.js';
import { forgotPasswordSchema, loginSchema, registerSchema, resetPasswordSchema } from './auth.validation.js';
import { authLimiter, emailVerificationLimiter, passwordResetLimiter } from '../../middlewares/rateLimiter.js';
import { authController } from './auth.controller.js';
import { guestMiddleware, authMiddleware } from '../../middlewares/auth.middleware.js';

const router = Router();

router.get('/log-in', guestMiddleware, authController.showLogin.bind(authController));
router.get('/register', guestMiddleware, authController.showRegister.bind(authController));
router.get('/verify-email', guestMiddleware, authController.showVerifyEmail.bind(authController));
router.get('/reset-password/:token', guestMiddleware, authController.showResetPassword.bind(authController));

router.post('/log-in', guestMiddleware, authLimiter, validate(loginSchema), authController.login.bind(authController));
router.post('/register', guestMiddleware, authLimiter, validate(registerSchema), authController.register.bind(authController));
router.post('/log-out', authMiddleware, authController.logout.bind(authController));

router.get('/auth/google', guestMiddleware, passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/log-in', session: false }), authController.loginWithGoogle);

router.post('/verify-email', guestMiddleware, emailVerificationLimiter, validate(forgotPasswordSchema), authController.forgotPassword.bind(authController));
router.post('/reset-password', guestMiddleware, passwordResetLimiter, validate(resetPasswordSchema), authController.resetPassword.bind(authController));

export default router;