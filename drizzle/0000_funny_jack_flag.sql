CREATE TYPE "public"."role" AS ENUM('USER', 'ADMIN', 'MODERATOR');--> statement-breakpoint
CREATE TYPE "public"."status" AS ENUM('ACTIVE', 'INACTIVE', 'BANNED');--> statement-breakpoint
CREATE TABLE "comments" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" serial NOT NULL,
	"postId" serial NOT NULL,
	"content" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "likes" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" serial NOT NULL,
	"postId" serial NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "password_reset_tokens" (
	"id" serial PRIMARY KEY NOT NULL,
	"token" varchar(255) NOT NULL,
	"userId" serial NOT NULL,
	"expiresAt" timestamp NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"used" boolean DEFAULT false NOT NULL,
	CONSTRAINT "password_reset_tokens_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "photos" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" serial NOT NULL,
	"postId" serial NOT NULL,
	"url" varchar(255) NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "posts" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" serial NOT NULL,
	"content" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"session_id" varchar(128) PRIMARY KEY NOT NULL,
	"expires" timestamp NOT NULL,
	"data" text
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"googleId" varchar(255),
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"password" varchar(255),
	"avatar" varchar(255),
	"role" "role" DEFAULT 'USER' NOT NULL,
	"status" "status" DEFAULT 'ACTIVE' NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_googleId_unique" UNIQUE("googleId"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE INDEX "comment_userId_idx" ON "comments" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "comment_postId_idx" ON "comments" USING btree ("postId");--> statement-breakpoint
CREATE UNIQUE INDEX "likes_userId_postId_unique" ON "likes" USING btree ("userId","postId");--> statement-breakpoint
CREATE INDEX "likes_postId_idx" ON "likes" USING btree ("postId");--> statement-breakpoint
CREATE INDEX "photo_userId_idx" ON "photos" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "photo_postId_idx" ON "photos" USING btree ("postId");--> statement-breakpoint
CREATE INDEX "post_userId_idx" ON "posts" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "email_idx" ON "users" USING btree ("email");--> statement-breakpoint
CREATE INDEX "role_idx" ON "users" USING btree ("role");--> statement-breakpoint
CREATE INDEX "status_idx" ON "users" USING btree ("status");