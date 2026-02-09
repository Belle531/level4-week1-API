/**
 * Day 3: add authorId and update/delete with ownership.
 *
 * @typedef {{ id: number, postId: number, body: string, authorId: number }} Comment
 */

export function createCommentsRepo() {
  /** @type {Comment[]} */
  const comments = [];
  let nextId = 1;

  return {
    listForPost(postId, { limit = 20, offset = 0 } = {}) {
      const all = comments.filter((c) => c.postId === postId);
      const total = all.length;
      const items = all.slice(offset, offset + limit);
      return { items, total };
    },

    getById(id) {
      return comments.find((c) => c.id === id) ?? null;
    },

    create({ postId, body, authorId }) {
      const comment = { id: nextId++, postId, body, authorId };
      comments.push(comment);
      return comment;
    },

    update({ id, body, authorId }) {
      const comment = comments.find((c) => c.id === id) ?? null;
      if (!comment) return null;
      if (comment.authorId !== authorId) return 'forbidden';

      comment.body = body;
      return comment;
    },

    delete({ id, authorId }) {
      const idx = comments.findIndex((c) => c.id === id);
      if (idx === -1) return null;
      if (comments[idx].authorId !== authorId) return 'forbidden';

      comments.splice(idx, 1);
      return true;
    },
  };
}