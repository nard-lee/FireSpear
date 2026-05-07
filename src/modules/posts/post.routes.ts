import { Router } from 'express';

import { uploadPostPhotos } from '../../middlewares/upload.js'; 
import { postController } from './post.controller.js';
import { validate } from '../../middlewares/validate.js';
import { createPostSchema } from './post.validation.js';

const router = Router();

router.post('/feed/post', validate(createPostSchema), uploadPostPhotos.array('photos'), postController.createPost.bind(postController));

export default router;
