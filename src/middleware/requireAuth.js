import { unauthorized } from '#utils/httpErrors';
import { verifyToken } from '#utils/jwt';

/**
 * Requires a valid Bearer token.
 * Sets req.user = { id } on success.
 */
export function requireAuth(req, _res, next) {
  const header = req.headers.authorization ?? '';
  const [scheme, token] = header.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return next(unauthorized('Missing Bearer token'));
  }

  try {
    const secret = req.app.locals.config.JWT_SECRET;

    const payload = verifyToken({ token, secret });

    req.user = { id: Number(payload.sub) };
    return next();
  } catch {
    return next(unauthorized('Invalid token'));
  }
}