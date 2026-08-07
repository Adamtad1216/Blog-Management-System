import { uploadToCloudinary, buildUploadOptions } from '../services/cloudinaryService.js';
import { upload } from '../middleware/upload.js';

export const uploadImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file uploaded' });
    }

    const options = buildUploadOptions(req.file, 'blog-images');
    const result = await uploadToCloudinary(req.file.buffer, options);

    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

export const uploadMiddleware = upload.single('image');
