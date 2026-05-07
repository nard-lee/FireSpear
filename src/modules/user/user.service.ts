import db from '../../database/index.js';
import { users } from '../../database/schema.js';
import { eq, desc, count } from 'drizzle-orm';
import { CreateUserDto, SharedUser, UpdateUserDto, User } from './user.model.js';
import { handleDbError } from '../../errors/db.error.js';

const toSharedUser = (user: User): SharedUser => ({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    avatar: user.avatar,
});

export class UserService {

    async findAll(page: number = 1, limit: number = 10): Promise<{ users: SharedUser[]; total: number; pages: number }> {
        const offset = (page - 1) * limit;
        const [allUsers, [{ value: total }]] = await Promise.all([
            db.select().from(users).orderBy(desc(users.createdAt)).limit(limit).offset(offset),
            db.select({ value: count() }).from(users),
        ]);
        return {
            users: allUsers.map(toSharedUser),
            total: Number(total),
            pages: Math.ceil(Number(total) / limit),
        };
    }

    async findById(id: number): Promise<SharedUser | null> {
        const [user] = await db.select().from(users).where(eq(users.id, id));
        return user ? toSharedUser(user) : null;
    }

    async findByEmail(email: string): Promise<User | null> {
        const [user] = await db.select().from(users).where(eq(users.email, email));
        return user ?? null;
    }

    async findByGoogleId(googleId: string): Promise<User | null> {
        const [user] = await db.select().from(users).where(eq(users.googleId, googleId));
        return user ?? null;
    }

    async create(data: CreateUserDto): Promise<SharedUser> {
        try {
            const [result] = await db.insert(users).values(data);
            const [user] = await db.select().from(users).where(eq(users.id, result.insertId));
            if (!user) throw new Error(`User not found after insert: ${result.insertId}`);
            return toSharedUser(user);
        } catch (err) {
            handleDbError(err);
        }
    }

    async update(id: number, data: UpdateUserDto): Promise<SharedUser> {
        await db.update(users).set(data).where(eq(users.id, id));
        const [user] = await db.select().from(users).where(eq(users.id, id));
        return toSharedUser(user);
    }

    async updateInternal(id: number, data: UpdateUserDto) {
        await db.update(users).set(data).where(eq(users.id, id));
        const [user] = await db.select().from(users).where(eq(users.id, id));
        return user;
    }

    async createInternal(data: CreateUserDto) {
        const [result] = await db.insert(users).values(data);
        const [user] = await db.select().from(users).where(eq(users.id, result.insertId));
        return user;
    }

    async delete(id: number): Promise<void> {
        await db.delete(users).where(eq(users.id, id));
    }
}

export const userService = new UserService();