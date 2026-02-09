import bcrypt from 'bcryptjs';

/**
 * Hashes a password using bcrypt.
 * NOTE: bcryptjs is JS-only and works well in teaching environments.
 *
 * @param {string} password
 * @returns {string}
 */
export function hashPassword(password) {
  const saltRounds = 10;

  return bcrypt.hashSync(password, saltRounds);
}

/**
 * Compares plaintext password with stored hash.
 *
 * @param {string} password
 * @param {string} hash
 * @returns {boolean}
 */
export function verifyPassword(password, hash) {
  return bcrypt.compareSync(password, hash);
}