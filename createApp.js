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
// import { commentsRouter } from '#routes/comments.routes'; 

export function createApp({ repos, config = {} }) {
  const app = express();

  // 1. Global Settings & Security
  app.locals.config = config;
  app.use(cors()); // Allows your frontend to talk to this API
  app.use(helmet()); // Sets security headers
  app.use(morgan('dev')); // Logs requests to your terminal
  app.use(express.json()); // Parses JSON bodies
  app.use(respond); // Attaches res.ok, res.created, etc.

  // 2. Dependency Injection
  app.use((_req, res, next) => {
    res.locals.repos = repos;
    next();
  });

  // 3. Health Check
  app.get('/health', (_req, res) => {
    res.json({ status: 'ok', message: 'ContentHub API is healthy' });
  });

  // 4. Routes
  app.use('/posts', postsRouter);
  app.use('/auth', authRouter);
  // app.use('/comments', commentsRouter);

  // 5. Error Handling (Must be at the bottom)
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}