import { Router } from 'express';
import { authMiddleware } from '../../middlewares/auth.middleware.js';
import { profileController } from './profile.controller.js';
// import { sensitiveActionLimiter } from '../../middlewares/rateLimiter.js';
import { validate } from '../../middlewares/validate.js';
import { updateEmailSchema, updateNameSchema, updatePasswordSchema } from './profile.validation.js';
import { uploadAvatar } from '../../middlewares/upload.js';

const router = Router();

router.get('/profile', authMiddleware, profileController.showProfile.bind(profileController));

router.patch('/profile/avatar', authMiddleware, uploadAvatar.single('avatar'), profileController.updateAvatar.bind(profileController));
router.patch('/profile/name', authMiddleware, validate(updateNameSchema), profileController.updateName.bind(profileController));
router.patch('/profile/email', authMiddleware, validate(updateEmailSchema), profileController.updateEmail.bind(profileController));
router.patch('/profile/password', authMiddleware, validate(updatePasswordSchema), profileController.updatePassword.bind(profileController));

export default router;