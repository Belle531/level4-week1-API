import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

// Middleware imports
import { errorHandler } from '#middleware/errorHandler';
import { notFoundHandler } from '#middleware/notFoundHandler';
import { respond } from '#middleware/respond';

// Route imports
import { postsRouter } from '#routes/posts.routes';
import { authRouter } from '#routes/auth.routes';
import { commentsRouter } from '#routes/comments.routes'; 

export function createApp({ repos, config = {} }) {
  const app = express();

  // 1. DEPENDENCY INJECTION
  app.locals.repos = repos;
  app.locals.config = config;

  // 2. GLOBAL MIDDLEWARE
  app.use(cors());
  app.use(helmet());
  app.use(morgan('dev'));
  app.use(express.json());
  app.use(respond);

  // 3. REPOSITORY ACCESSIBILITY
  app.use((_req, res, next) => {
    res.locals.repos = repos;
    next();
  });

  // 4. HEALTH CHECK
  app.get('/health', (_req, res) => {
    res.json({ 
      status: 'ok', 
      message: 'Cassandra Digital Solutions API is healthy' 
    });
  });

  // 5. ROUTES
  app.use('/auth', authRouter);
  app.use('/posts', postsRouter);
  app.use('/comments', commentsRouter);

  // 6. ERROR HANDLING
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}