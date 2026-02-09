/**
 * Attaches global response helpers to res.
 *
 * Starting Day 2, all successful responses follow:
 *   { data: <payload>, meta?: {...} }
 */
export function respond(_req, res, next) {
  /**
   * 200 OK
   * @param {any} data
   * @param {object} [meta]
   */
  res.ok = (data, meta) => res.status(200).json({ data, ...(meta ? { meta } : {}) });

  /**
   * 201 Created
   * @param {any} data
   * @param {object} [meta]
   */
  res.created = (data, meta) => res.status(201).json({ data, ...(meta ? { meta } : {}) });

  /**
   * 204 No Content
   */
  res.noContent = () => res.status(204).send();

  next();
}