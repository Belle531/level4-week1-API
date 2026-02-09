import { notFound } from '#utils/httpErrors';

/**
 * Runs after all routes. Produces a consistent 404 response.
 */
export function notFoundHandler(req, _res, next) {
  next(notFound(`Route not found: ${req.method} ${req.path}`));
}