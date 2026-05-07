import multer, { FileFilterCallback } from 'multer';
import path from 'path';
import fs from 'fs';
import { Request } from 'express';

const imageFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
  const allowed = ['image/jpeg', 'image/png', 'image/webp'];
  if (!allowed.includes(file.mimetype)) {
    cb(new Error('Only JPEG, PNG and WebP are allowed.'));
  } else {
    cb(null, true);
  }
};

const makeStorage = (type: 'avatars' | 'posts') => multer.diskStorage({
  destination: (req, file, cb) => {
    const user = req.session.user;
    if (!user || !user.id) return cb(new Error('Unauthorized'), '');

    const id = user.id;
    const name = user.name?.toLowerCase().replace(/\s+/g, '_') || 'user';
    let dir = `public/uploads/${type}/${id}_${name}`;

    if (type === 'posts') {
      const postFolder = new Date().toISOString().replace(/[-:T]/g, '').slice(0, 15);
      dir = path.join(dir, postFolder);
    }

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}_${Math.random().toString(36).slice(2, 7)}${ext}`);
  }
});


export const uploadAvatar = multer({
  storage: makeStorage('avatars'),
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: imageFilter
});

export const uploadPostPhotos = multer({
  storage: makeStorage('posts'),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: imageFilter
});