import argon2 from "argon2";

import { userService } from "../user/user.service.js";
import { UpdatePasswordDto } from "./profile.model.js";

export class ProfileService {
    
    async updatePassword(email: string, data: UpdatePasswordDto): Promise<void> {

        const existing = await userService.findByEmail(email);
        
        if (!existing) throw { errors: { email: 'Invalid session' } };
        if (!existing.password) throw { errors: { general: 'Invalid session.' } };
        
        const match = await argon2.verify(existing.password, data.currentPassword);
        if (!match) throw { errors: { currentPassword: 'Password invalid' } };

        const hashed = await argon2.hash(data.password!, {
            type: argon2.argon2id,
            memoryCost: 19456,
            timeCost: 2,
            parallelism: 1,
        });

        await userService.update(Number(existing.id), { password: hashed });
    }
}

export const profileService = new ProfileService();

