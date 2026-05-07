import { Request, Response, NextFunction } from 'express';
import { userService } from '../modules/user/user.service.js';

const USER_REFRESH_INTERVAL = 1000 * 60 * 10;

export const authMiddleware = async (req: Request,res: Response,next: NextFunction): Promise<void> => {

  const { userId, user, lastSync } = req.session;

  if (!userId) return res.redirect('/log-in');

  try {
    const now = Date.now();

    if (!lastSync || now - lastSync > USER_REFRESH_INTERVAL) {
      const freshUser = await userService.findById(userId);

      if (!freshUser) {
        req.session.destroy(() => {});
        return res.redirect('/log-in');
      }

      req.session.user = freshUser;
      req.session.lastSync = now;

      req.user = freshUser;
      res.locals.user = freshUser;

    } else {

      req.user = user;
      res.locals.user = user;
    }

    next();

  } catch (err) {
    res.status(500).send('Server error');
  }
};
export const guestMiddleware = (req: Request, res: Response, next: NextFunction): void => {
    if (req.session.userId) {
        res.redirect('/dashboard');
        return;
    }
    next();
};