import db from '../../database/index.js';
import { posts, photos } from '../../database/schema.js';
import { CreatePostDto } from './post.model.js';

export class PostService {
    async create(data: CreatePostDto) {

        return await db.transaction(async (tx) => {
            const [result] = await tx.insert(posts).values({
                content: data.content,
                userId: data.userId,
            }).returning();

            const postId = result.id;
            const photoUrls = data.photos ?? [];

            if (photoUrls.length > 0) {
                await tx.insert(photos).values(
                    photoUrls.map(url => ({
                        url,
                        userId: data.userId,
                        postId: postId,
                    }))
                );
            }

            return { id: postId, ...data, photos: photoUrls };
        });
    }
}

export const postService = new PostService();
