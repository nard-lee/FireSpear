import { PublicUser } from '../modules/user/user.model.ts';

declare module 'express-session' {
  interface SessionData {
    userId?: number;
    user?: PublicUser;
    lastSync: number;
  }
}