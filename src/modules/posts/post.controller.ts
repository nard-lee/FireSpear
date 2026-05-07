import { Request, Response } from "express";
import { postService } from "./post.service.js";

export class PostController {

    async createPost(req: Request, res: Response): Promise<void> {
        try {
            const { title, content } = req.body;
            const user = req.session.user;

            if (!user?.id) throw { error: { status: 'error', message: 'Unauthorized' } };
            
            const files = req.files as Express.Multer.File[] | undefined;
            const photos = files?.map(f => f.path.replace(/\\/g, '/').replace('public', '')) || [];

            const post = await postService.create({
                content,
                userId: user.id,
                photos
            });

            res.status(201).json({ status: 'success', data: post });
        } catch (err: unknown) {
            console.error('Create Post Error:', err);
            res.status(500).json({ status: 'error', message: 'Internal server error' });
        }
    }

}

export const postController = new PostController();