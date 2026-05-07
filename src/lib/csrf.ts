import { csrfSync } from 'csrf-sync';

export const { csrfSynchronisedProtection, generateToken } = csrfSync({
  getTokenFromRequest: (req) =>
    req.headers['x-csrf-token'] as string ?? req.body._csrf,
});