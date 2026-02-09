import { badRequest } from '#utils/httpErrors';

/**
 * Throws the provided error when condition is false.
 *
 * @param {any} condition
 * @param {Error} err
 */
export function ensure(condition, err) {
  if (!condition) {
    throw err;
  }
}

/**
 * Ensures required fields exist in an object (simple teaching-focused validation).
 * Throws a 400 Bad Request when missing.
 *
 * @param {object} obj
 * @param {string[]} fields
 */
export function ensureBodyFields(obj, fields) {
  const missing = fields.filter((f) => !obj?.[f]);
  if (missing.length > 0) {
    throw badRequest('Missing required fields', { missing });
  }
}