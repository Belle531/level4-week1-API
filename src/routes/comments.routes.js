import { notFound, forbidden } from '#utils/httpErrors';
import { ensureBodyFields } from '#utils/guard';
import { parsePagination } from '#utils/pagination';

/**
 * GET /posts/:postId/comments
 */
export function listCommentsForPost(req, res) {
  const { comments } = req.app.locals.repos;
  const postId = Number(req.params.postId);

  const { limit, offset } = parsePagination(req.query);
  const result = comments.listByPostId({ postId, limit, offset });

  return res.ok(result.items, {
    pagination: { limit, offset, total: result.total },
  });
}

/**
 * POST /posts/:postId/comments (AUTH REQUIRED)
 */
export function createCommentForPost(req, res) {
  const { comments, posts } = req.app.locals.repos;
  const postId = Number(req.params.postId);

  // Verify the post exists before commenting
  const post = posts.getById(postId);
  if (!post) throw notFound('Post not found');

  ensureBodyFields(req.body, ['body']);

  const created = comments.create({
    body: req.body.body,
    postId,
    authorId: req.user.id,
  });

  return res.status(201).json({ data: created });
}

/**
 * PUT /comments/:id (AUTH + OWNER)
 */
export function updateComment(req, res) {
  const { comments } = req.app.locals.repos;
  const id = Number(req.params.id);

  ensureBodyFields(req.body, ['body']);

  const updated = comments.update({
    id,
    body: req.body.body,
    authorId: req.user.id,
  });

  if (updated === null) throw notFound('Comment not found');
  if (updated === 'forbidden') throw forbidden('You do not own this comment');

  return res.ok(updated);
}

/**
 * DELETE /comments/:id (AUTH + OWNER)
 */
export function deleteComment(req, res) {
  const { comments } = req.app.locals.repos;
  const id = Number(req.params.id);

  const result = comments.delete({ id, authorId: req.user.id });

  if (result === null) throw notFound('Comment not found');
  if (result === 'forbidden') throw forbidden('You do not own this comment');

  return res.noContent();
}