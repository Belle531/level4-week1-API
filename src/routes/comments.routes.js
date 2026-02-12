import { Router } from 'express';
import { 
  updateComment, 
  deleteComment 
} from '#controllers/comments.controller';
import { requireAuth } from '#middleware/requireAuth';

// This is the "Named Export" that createApp.js is looking for.
// Ensure there is an 's' in commentsRouter!
export const commentsRouter = Router(); 

// Update a specific comment
commentsRouter.put('/:id', requireAuth, updateComment);

// Delete a specific comment
commentsRouter.delete('/:id', requireAuth, deleteComment);