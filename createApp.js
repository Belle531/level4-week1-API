import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';

import { postsRouter } from '#routes/posts.routes';
import { errorHandler } from '#middleware/errorHandler';

/**
 * Factory that creates the Express app with injected dependencies.
 * This is the pattern that makes testing easy with Supertest.
 *
 * @param {{ repos: any }} deps
 * @returns {import('express').Express}
 */
export function createApp({ repos }) {
  // Express functions always return objects that have functionality built in
  // Initialize the app object that's returned from the Express function
  const app = express();

  // Parse JSON request bodies
  app.use(express.json());

  // Security headers
  app.use(helmet());

  // Request logging (dev-friendly)
  app.use(morgan('dev'));

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

  // Error handling middleware must be last (4 args signature)
  app.use(errorHandler);

  return app;
}