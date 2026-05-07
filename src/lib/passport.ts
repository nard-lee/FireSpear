import 'dotenv/config';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { authService } from '../modules/auth/auth.service.js';
import { config } from '../config/index.js';

passport.use(
    new GoogleStrategy(
        {
            clientID: config.googleClientId,
            clientSecret: config.googleClientSecret,
            callbackURL: '/auth/google/callback',
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const user = await authService.loginWithGoogle(profile);
                return done(null, user);
            } catch (err) {
                return done(err, false);
            }
        }
    )
);

export default passport;