import { Router } from 'express';
import { requireAuth } from '#middleware/requireAuth';
import { updateComment, deleteComment } from '#controllers/comments.controller';

export const commentsRouter = Router();

commentsRouter.put('/:id', requireAuth, updateComment);
commentsRouter.delete('/:id', requireAuth, deleteComment);