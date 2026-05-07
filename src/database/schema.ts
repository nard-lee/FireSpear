
import { pgTable, serial, varchar, text, boolean, timestamp, pgEnum, uniqueIndex, index } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// ── Enums ─────────────────────────────────────────────────────────────────

export const roleEnum = pgEnum('role', ['USER', 'ADMIN', 'MODERATOR']);
export const statusEnum = pgEnum('status', ['ACTIVE', 'INACTIVE', 'BANNED']);

// ── Tables ────────────────────────────────────────────────────────────────

export const users = pgTable('users', {
    id:        serial().primaryKey(),
    googleId:  varchar({ length: 255 }).unique(),
    name:      varchar({ length: 255 }).notNull(),
    email:     varchar({ length: 255 }).notNull().unique(),
    password:  varchar({ length: 255 }),
    avatar:    varchar({ length: 255 }),
    role:      roleEnum().default('USER').notNull(),
    status:    statusEnum().default('ACTIVE').notNull(),
    createdAt: timestamp().defaultNow().notNull(),
    updatedAt: timestamp().defaultNow().notNull(),
}, t => [
    index('email_idx').on(t.email),
    index('role_idx').on(t.role),
    index('status_idx').on(t.status),
]);

// export const sessions = pgTable('sessions', {
//     session_id: varchar({ length: 128 }).primaryKey(),
//     expires:    timestamp().notNull(),
//     data:       text(),
// });

export const passwordResetTokens = pgTable('password_reset_tokens', {
    id:        serial().primaryKey(),
    token:     varchar({ length: 255 }).notNull().unique(),
    userId:    serial().notNull(),
    expiresAt: timestamp().notNull(),
    createdAt: timestamp().defaultNow().notNull(),
    used:      boolean().default(false).notNull(),
});

export const posts = pgTable('posts', {
    id:        serial().primaryKey(),
    userId:    serial().notNull(),
    content:   text().notNull(),
    createdAt: timestamp().defaultNow().notNull(),
    updatedAt: timestamp().defaultNow().notNull(),
}, t => [
    index('post_userId_idx').on(t.userId),
]);

export const comments = pgTable('comments', {
    id:        serial().primaryKey(),
    userId:    serial().notNull(),
    postId:    serial().notNull(),
    content:   text().notNull(),
    createdAt: timestamp().defaultNow().notNull(),
    updatedAt: timestamp().defaultNow().notNull(),
}, t => [
    index('comment_userId_idx').on(t.userId),
    index('comment_postId_idx').on(t.postId),
]);

export const likes = pgTable('likes', {
    id:        serial().primaryKey(),
    userId:    serial().notNull(),
    postId:    serial().notNull(),
    createdAt: timestamp().defaultNow().notNull(),
}, t => [
    uniqueIndex('likes_userId_postId_unique').on(t.userId, t.postId),
    index('likes_postId_idx').on(t.postId),
]);

export const photos = pgTable('photos', {
    id:        serial().primaryKey(),
    userId:    serial().notNull(),
    postId:    serial(),
    url:       varchar({ length: 255 }).notNull(),
    createdAt: timestamp().defaultNow().notNull(),
}, t => [
    index('photo_userId_idx').on(t.userId),
    index('photo_postId_idx').on(t.postId),
]);

// ── Relations ─────────────────────────────────────────────────────────────
export const usersRelations = relations(users, ({ many }) => ({
    posts:               many(posts),
    comments:            many(comments),
    likes:               many(likes),
    photos:              many(photos),
    passwordResetTokens: many(passwordResetTokens),
}));

export const passwordResetTokensRelations = relations(passwordResetTokens, ({ one }) => ({
    user: one(users, { fields: [passwordResetTokens.userId], references: [users.id] }),
}));

export const postsRelations = relations(posts, ({ one, many }) => ({
    user:     one(users, { fields: [posts.userId], references: [users.id] }),
    comments: many(comments),
    likes:    many(likes),
    photos:   many(photos),
}));

export const commentsRelations = relations(comments, ({ one }) => ({
    user: one(users, { fields: [comments.userId], references: [users.id] }),
    post: one(posts, { fields: [comments.postId], references: [posts.id] }),
}));

export const likesRelations = relations(likes, ({ one }) => ({
    user: one(users, { fields: [likes.userId], references: [users.id] }),
    post: one(posts, { fields: [likes.postId], references: [posts.id] }),
}));

export const photosRelations = relations(photos, ({ one }) => ({
    user: one(users, { fields: [photos.userId], references: [users.id] }),
    post: one(posts, { fields: [photos.postId], references: [posts.id] }),
}));
