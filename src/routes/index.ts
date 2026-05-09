
import { Router, Request, Response } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import authRoutes from '../modules/auth/auth.routes.js';
import profileRoutes from '../modules/profile/profile.routes.js';
import userRoutes from '../modules/user/user.routes.js';
import postRoutes from '../modules/posts/post.routes.js';

import db from '../database/index.js';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  res.render('welcome', {
    title: 'FireSpear',
    layout: 'layouts/layout'
  });
});

router.get('/dashboard', authMiddleware, async (req: Request, res: Response) => {
  const posts = await db.query.posts.findMany({
    with: {
      user: {
        columns: {
          id: true,
          name: true,
          avatar: true,
        }
      },
      photos: true,
    },
    orderBy: (posts, { desc }) => [desc(posts.createdAt)],
  });

  res.render('pages/dashboard', {
    title: 'Dashboard',
    layout: 'layouts/app',
    posts,
  });
});

router.use(authRoutes);
router.use(profileRoutes);
router.use(userRoutes);
router.use(postRoutes);

export default router;