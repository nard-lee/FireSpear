import { InferSelectModel, InferInsertModel } from 'drizzle-orm';
import { posts } from '../../database/schema.js';
import { SharedUser } from '../user/user.model.js'; // Assuming the name we picked

export type Post = InferSelectModel<typeof posts>;

export type CreatePostDto = InferInsertModel<typeof posts> & {
  photos?: string[];
};

export type UpdatePostDto = Partial<CreatePostDto>;

export interface PostResponse extends Omit<Post, 'userId'> {
  author: SharedUser;
  photos: { id: number; url: string; caption: string | null }[];
  _count?: {
    comments: number;
    likes: number;
  };
}
