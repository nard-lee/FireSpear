import argon2 from "argon2";
import crypto from 'crypto';
import { Profile } from 'passport-google-oauth20';
import { eq, and } from 'drizzle-orm';

import db from '../../database/index.js';
import { passwordResetTokens, users } from '../../database/schema.js';
import { userService } from '../user/user.service.js';
import { LoginDto, RegisterDto } from './auth.model.js';
import { sendPasswordResetEmail } from '../../lib/mailer.js';
import { SharedUser } from "../user/user.model.js";

export class AuthService {

    async register(data: RegisterDto): Promise<void> {
        await userService.create({
            name: data.name,
            email: data.email,
            password: await argon2.hash(data.password, {
                type: argon2.argon2id,
                memoryCost: 8192,
                timeCost: 2,
                parallelism: 2,
            }),
        });
    }

    async login(data: LoginDto): Promise<SharedUser> {
        const user = await userService.findByEmail(data.email);

        if (!user) throw { errors: { email: 'Email doesnt exist' } };
        if (!user.password) throw { errors: { general: 'Invalid session.' } };

        const match = await argon2.verify(user.password, data.password);

        if (!match) throw { errors: { password: 'Password invalid' } };
        return user;
    }

    async loginWithGoogle(profile: Profile): Promise<SharedUser> {
        const email = profile.emails?.[0]?.value;

        if (!email) throw { errors: { general: 'No email from Google account' } };

        const avatar = profile.photos?.[0]?.value;
        let user = await userService.findByGoogleId(profile.id);

        if (!user) {
            user = await userService.findByEmail(email);
            if (user) {
                user = await userService.updateInternal(user.id, {
                    googleId: profile.id,
                    avatar: user.avatar ?? avatar,
                });
            } else {
                user = await userService.createInternal({
                    name: profile.displayName,
                    email,
                    googleId: profile.id,
                    avatar,
                });
            }
        }

        return user;
    }

    async forgotPassword(email: string): Promise<void> {
        const user = await userService.findByEmail(email);
        if (!user) throw { errors: { email: 'Invalid email' } };

        await db.update(passwordResetTokens)
            .set({ used: true })
            .where(and(
                eq(passwordResetTokens.userId, user.id),
                eq(passwordResetTokens.used, false)
            ));

        const token = crypto.randomBytes(32).toString('hex');
        const expiresAt = new Date(Date.now() + 1000 * 60 * 60);

        await db.insert(passwordResetTokens).values({
            token,
            userId: user.id,
            expiresAt,
        });

        await sendPasswordResetEmail(user.email, token);
    }

    async resetPassword(token: string, newPassword: string): Promise<void> {
        const [record] = await db.select()
            .from(passwordResetTokens)
            .where(eq(passwordResetTokens.token, token));

        if (!record || record.used || record.expiresAt < new Date()) {
            throw { errors: { general: 'Invalid or expired reset link' } };
        }

        const hashed = await argon2.hash(newPassword, {
            type: argon2.argon2id,
            memoryCost: 8192,
            timeCost: 2,
            parallelism: 2,
        });

        await db.transaction(async (tx) => {
            await tx.update(users)
                .set({ password: hashed })
                .where(eq(users.id, record.userId));

            await tx.delete(passwordResetTokens)
                .where(eq(passwordResetTokens.userId, record.userId));
        });
    }
}

export const authService = new AuthService();