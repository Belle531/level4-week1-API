import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';

import { errorHandler } from '#middleware/errorHandler';
import { notFoundHandler } from '#middleware/notFoundHandler';
import { respond } from '#middleware/respond';

import { postsRouter } from '#routes/posts.routes';
import { authRouter } from '#routes/auth.routes';
import { commentsRouter } from '#routes/comments.routes';

/**
 * Factory that creates the Express app with injected dependencies.
 * This is the pattern that makes testing easy with Supertest.
 *
 * @param {{ repos: any, config?: object }} deps
 * @returns {import('express').Express}
 */
export function createApp({ repos, config = {} }) {
  // Express functions always return objects that have functionality built in
  // Initialize the app object that's returned from the Express function
  const app = express();

  app.locals.config = config;

  // Parse JSON request bodies
  app.use(express.json());

  // Security headers
  app.use(helmet());

  // Request logging (dev-friendly)
  app.use(morgan('dev'));

  // Response helpers (res.ok/res.created/etc)
  app.use(respond);

  // Health check endpoint
  app.get('/health', (_req, res) => {
    res.json({ status: 'ok', message: 'App is running correctly' });
  });

  // Attach repositories to res.locals so controllers can access them
  app.use((_req, res, next) => {
    res.locals.repos = repos;
    next();
  });

  // Routes
  app.use('/posts', postsRouter);
  app.use('/auth', authRouter);
  app.use('/comments', commentsRouter);

  // Caught not defined routes with a specif message
  app.use(notFoundHandler);

  // Error handling middleware must be last (4 args signature)
  app.use(errorHandler);

  return app;
}