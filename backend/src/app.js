import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import routes from './routes/index.js';
import commentsRoutes from './routes/comments.routes.js';
import likesRoutes from './routes/likes.routes.js';
import bookmarksRoutes from './routes/bookmarks.routes.js';
import { setupSwagger } from './config/swagger.js';

const app = express();

app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

app.get('/', (_req, res) => {
  res.json({ message: 'Blog Management System API is running' });
});

app.get('/api/health', (_req, res) => {
  res.json({ success: true, message: 'API is healthy' });
});

// Developer A Routes (Auth & Users)
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// Developer B Routes (Posts, Categories, Tags, Uploads, Search)
app.use('/api', routes);

// Developer C Routes (Comments, Likes, Bookmarks)
app.use('/api', commentsRoutes);
app.use('/api', likesRoutes);
app.use('/api', bookmarksRoutes);

// Setup Swagger Documentation at /api-docs and /api/docs
setupSwagger(app);

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

export default app;
