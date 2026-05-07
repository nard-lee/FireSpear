import { InferSelectModel, InferInsertModel } from 'drizzle-orm';
import { users } from '../../database/schema.js';

export type User = InferSelectModel<typeof users>;
export type SharedUser = Pick<User, 'id' | 'name' | 'email' | 'role' | 'avatar'>;

export type CreateUserDto = InferInsertModel<typeof users>;
export type UpdateUserDto = Partial<CreateUserDto>;

export interface RegisterDto {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface LoginDto {
  email: string;
  password: string;
}
