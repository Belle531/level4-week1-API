import { conflict, unauthorized } from '#utils/httpErrors';
import { ensureBodyFields } from '#utils/guard';
import { hashPassword, verifyPassword } from '#utils/password';
import { signToken } from '#utils/jwt';

/**
 * POST /auth/register
 */
export function registerUser(req, res) {
  const { users } = res.locals.repos;

  ensureBodyFields(req.body, ['email', 'name', 'password']);

  const email = String(req.body.email).toLowerCase().trim();
  const name = String(req.body.name).trim();
  const password = String(req.body.password);

  if (users.findByEmail(email)) {
    throw conflict('Email already registered');
  }

  const user = users.create({
    email,
    name,
    passwordHash: hashPassword(password),
  });

  const token = signToken({ userId: user.id, secret: req.app.locals.config.JWT_SECRET });

  return res.created({
    token,
    user: { id: user.id, email: user.email, name: user.name },
  });
}

/**
 * POST /auth/login
 */
export function loginUser(req, res) {
  const { users } = res.locals.repos;

  ensureBodyFields(req.body, ['email', 'password']);

  const email = String(req.body.email).toLowerCase().trim();
  const password = String(req.body.password);

  const user = users.findByEmail(email);
  if (!user) {
    throw unauthorized('Invalid credentials');
  }

  if (!verifyPassword(password, user.passwordHash)) {
    throw unauthorized('Invalid credentials');
  }

  const token = signToken({ userId: user.id, secret: req.app.locals.config.JWT_SECRET });

  return res.ok({
    token,
    user: { id: user.id, email: user.email, name: user.name },
  });
}