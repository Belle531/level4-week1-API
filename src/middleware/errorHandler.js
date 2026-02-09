/**
 * Central error handler.
 * IMPORTANT: Express recognizes this as error middleware because it has 4 args.
 *
 * @param {Error} err
 * @param {import('express').Request} _req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} _next
 */
export function errorHandler(err, _req, res, _next) {
  console.error(err);

  res.status(500).json({
    error: {
      message: 'Internal Server Error',
    },
  });
}import { HttpError } from '#utils/httpErrors';

/**
 * Central error handler.
 * IMPORTANT: Express recognizes error middleware because it has 4 arguments.
 *
 * @param {Error} err
 * @param {import('express').Request} _req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} _next
 */
export function errorHandler(err, _req, res, _next) {
  console.error(err);

  // Our known HTTP errors
  if (err instanceof HttpError) {
    return res.status(err.status).json({
      error: {
        message: err.message,
        code: err.code,
        ...(err.details !== undefined ? { details: err.details } : {}),
      },
    });
  }

  // Unknown/unexpected errors
  return res.status(500).json({
    error: {
      message: 'Internal Server Error',
      code: 'internal_error',
    },
  });
}