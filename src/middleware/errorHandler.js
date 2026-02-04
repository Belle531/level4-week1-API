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
}