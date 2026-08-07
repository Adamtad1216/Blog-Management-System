import { uploadToCloudinary, buildUploadOptions } from '../services/cloudinaryService.js';
import { upload } from '../middleware/upload.js';

export const uploadImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file uploaded' });
    }

    let url;
    try {
      const options = buildUploadOptions(req.file, 'blog-images');
      const result = await uploadToCloudinary(req.file.buffer, options);
      url = result.secure_url || result.url;
    } catch (_err) {
      const mime = req.file.mimetype || 'image/png';
      url = `data:${mime};base64,${req.file.buffer.toString('base64')}`;
    }

    res.status(200).json({ success: true, url, data: { url } });
  } catch (error) {
    next(error);
  }
};

export const uploadMiddleware = upload.single('image');
