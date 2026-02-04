/**
 * GET /posts
 */
export function listPosts(_req, res) {
  const { posts } = res.locals.repos;
  res.json({ data: posts.list() });
}

/**
 * POST /posts
 */
export function createPost(req, res) {
  const { title, body } = req.body ?? {};
  const { posts } = res.locals.repos;

  if (!title || !body) {
    return res.status(400).json({
      error: { message: 'title and body are required' },
    });
  }

  const created = posts.create({ title, body });
  return res.status(201).json({ data: created });
}