import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';

import { errorHandler } from '#middleware/errorHandler';
import { notFoundHandler } from '#middleware/notFoundHandler';
import { respond } from '#middleware/respond';

// FIX: We use curly braces here to match the 'Named Exports' in the route files
import { postsRouter } from '#routes/posts.routes';
import { authRouter } from '#routes/auth.routes';
// import { commentsRouter } from '#routes/comments.routes'; // Uncomment when file exists

export function createApp({ repos, config = {} }) {
  const app = express();

  app.locals.config = config;

  app.use(express.json());
  app.use(helmet());
  app.use(morgan('dev'));
  app.use(respond);

  // Health check
  app.get('/health', (_req, res) => {
    res.json({ status: 'ok', message: 'ContentHub API is healthy' });
  });

  app.use((_req, res, next) => {
    res.locals.repos = repos;
    next();
  });

  // Routes - using the names imported above
  app.use('/posts', postsRouter);
  app.use('/auth', authRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}