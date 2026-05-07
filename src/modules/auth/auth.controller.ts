import { Request, Response, NextFunction } from 'express';

import { authService } from './auth.service.js';
import { SharedUser } from '../user/user.model.js';
import { DbError } from '../../errors/db.error.js';

export class AuthController {

    async register(req: Request, res: Response): Promise<void> {
        try {
            await authService.register(req.body);
            res.status(201).json({ status: 'success' });
        } catch (err) {
            if (err instanceof DbError && err.isDuplicate) {
                res.status(409).json({ errors: { [err.field]: err.message } });
                return;
            }
            res.status(400).json({ message: 'Registration failed' });
        }
    }

    async login(req: Request, res: Response): Promise<void> {
        try {
            const user = await authService.login(req.body);
            req.session.userId = user.id;
            res.status(200).json({ status: 'success' });
        } catch (err: unknown) {
            res.status(400).json(err);
        }
    }

    async loginWithGoogle(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const user = req.user as SharedUser;
            if (!user) return res.redirect('/log-in');
            req.session.userId = user.id;
            req.session.user = user;
            res.locals.user = user;
            req.session.save((err) => {
                if (err) return next(err);
                res.redirect('/dashboard');
            });
        } catch (err) {
            next(err);
        }
    }

    async logout(req: Request, res: Response): Promise<void> {
        req.session.destroy((err) => {
            if (err) console.error('[Logout Error]', err);

            res.clearCookie('connect.sid');
            res.redirect('/log-in');
        });
    }

    async forgotPassword(req: Request, res: Response): Promise<void> {
        const { email } = req.body;
        try {
            const user = await authService.forgotPassword(email);
            res.status(200).json({ status: 'success', user });
        } catch (err: unknown) {
            res.status(400).json(err);
        }
    }

    async resetPassword(req: Request, res: Response): Promise<void> {
        const { reset_token, password } = req.body;
        try {
            const user = await authService.resetPassword(reset_token, password);
            res.status(200).json({ status: 'success', user });
        } catch (err: unknown) {
            res.status(400).json(err);
        }
    }

    showLogin(req: Request, res: Response): void {
        res.render('auth/login', {
            title: 'Login',
            layout: 'layouts/auth',
        });
    }

    showRegister(req: Request, res: Response): void {
        res.render('auth/register', {
            title: 'Register',
            layout: 'layouts/auth',
        });
    }

    showVerifyEmail(req: Request, res: Response): void {
        res.render('auth/verifyEmail', {
            title: 'Verify Email',
            layout: 'layouts/auth',
        })
    }

    showResetPassword(req: Request, res: Response): void {
        const { token } = req.params;
        console.log(token)
        res.render('auth/resetPassword', {
            title: 'Reset Password',
            layout: 'layouts/auth',
            reset_token: token
        })
    }

}

export const authController = new AuthController();