import { Router } from 'express';
import { listPosts, createPost } from '#controllers/posts.controller';

export const postsRouter = Router();

postsRouter.get('/', listPosts);
postsRouter.post('/', createPost);