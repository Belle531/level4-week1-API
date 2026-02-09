import { Router } from 'express';
import {
  listPosts,
  createPost,
  getPost,
  updatePost,
  deletePost,
} from '#controllers/posts.controller';
import { listCommentsForPost, createCommentForPost } from '#controllers/comments.controller';
import { requireAuth } from '#middleware/requireAuth';

export const postsRouter = Router();

postsRouter.get('/', listPosts);
postsRouter.get('/:id', getPost);
postsRouter.post('/', requireAuth, createPost);
postsRouter.put('/:id', requireAuth, updatePost);
postsRouter.delete('/:id', requireAuth, deletePost);

// Nest the comments inside a post
postsRouter.get('/:postId/comments', listCommentsForPost);
postsRouter.post('/:postId/comments', requireAuth, createCommentForPost);