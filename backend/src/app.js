import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import commentsRoutes from './modules/comments/comments.routes.js';
import likesRoutes from './modules/likes/likes.routes.js';
import bookmarksRoutes from './modules/bookmarks/bookmarks.routes.js';

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Health check endpoint (Dev A ownership)
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is healthy',
    data: { status: 'OK', timestamp: new Date() },
  });
});

// Developer C Routes (Comments, Likes, Bookmarks)
app.use('/api', commentsRoutes);
app.use('/api', likesRoutes);
app.use('/api', bookmarksRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err);
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  return res.status(statusCode).json({
    success: false,
    message,
    errors: err.errors || [],
  });
});

export default app;
