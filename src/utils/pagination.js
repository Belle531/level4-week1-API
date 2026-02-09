/**
 * Parses pagination parameters from query objects.
 *
 * @param {{ limit?: string|number, offset?: string|number }} query
 * @returns {{ limit: number, offset: number }}
 */
export function parsePagination(query = {}) {
  const rawLimit = query.limit ?? 20;
  const rawOffset = query.offset ?? 0;

  const limit = clampInt(rawLimit, 1, 100, 20);
  const offset = clampInt(rawOffset, 0, Number.MAX_SAFE_INTEGER, 0);

  return { limit, offset };
}

/**
 * @param {string|number} value
 * @param {number} min
 * @param {number} max
 * @param {number} fallback
 */
function clampInt(value, min, max, fallback) {
  const n = Number(value);

  if (!Number.isFinite(n)) return fallback;

  const i = Math.trunc(n);
  if (i < min) return min;
  if (i > max) return max;
  return i;
}