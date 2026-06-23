import multer from 'multer';

export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;

export const imageUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_UPLOAD_BYTES },
  fileFilter(_req, file, callback) {
    if (file.mimetype?.startsWith('image/')) {
      callback(null, true);
      return;
    }

    callback(new Error('Only image files are allowed.'));
  },
});
