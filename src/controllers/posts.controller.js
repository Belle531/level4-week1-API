import { notFound, forbidden } from '#utils/httpErrors';
import { ensureBodyFields } from '#utils/guard';
import { parsePagination } from '#utils/pagination';

/**
 * GET /posts
 */
export function listPosts(req, res) {
  // Pulling from app.locals.repos as set in your createApp.js
  const { posts } = req.app.locals.repos;

  // Fixed the query parsing and passed the query object
  const { limit, offset } = parsePagination(req.query);
  const result = posts.list({ limit, offset });

  return res.ok(result.items, {
    pagination: { limit, offset, total: result.total },
  });
}

/**
 * GET /posts/:id
 */
export function getPost(req, res) {
  const { posts } = req.app.locals.repos;

  // Get an id from the requests
  const id = Number(req.params.id);

  const post = posts.getById(id);

  if (!post) {
    throw notFound('Post not found');
  }

  return res.ok(post);
}

/**
 * POST /posts (AUTH REQUIRED)
 */
export function createPost(req, res) {
  const { posts } = req.app.locals.repos;
  ensureBodyFields(req.body, ['title', 'body']);

  const { title, body } = req.body ?? {};

  const created = posts.create({ title, body, authorId: req.user.id });
  return res.status(201).json({ data: created });
}

/**
 * PUT /posts/:id (AUTH + OWNER)
 */
export function updatePost(req, res) {
  const { posts } = req.app.locals.repos;
  const id = Number(req.params.id);

  ensureBodyFields(req.body, ['title', 'body']);

  const updated = posts.update({
    id,
    title: req.body.title,
    body: req.body.body,
    authorId: req.user.id,
  });

  if (updated === null) throw notFound('Post not found');
  if (updated === 'forbidden') throw forbidden('You do not own this post');

  return res.ok(updated);
}

/**
 * DELETE /posts/:id (AUTH + OWNER)
 */
export function deletePost(req, res) {
  const { posts } = req.app.locals.repos;
  const id = Number(req.params.id);

  const result = posts.delete({ id, authorId: req.user.id });

  if (result === null) throw notFound('Post not found');
  if (result === 'forbidden') throw forbidden('You do not own this post');

  return res.noContent();
}