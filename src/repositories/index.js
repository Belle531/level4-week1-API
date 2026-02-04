
/**
 * Creates repositories (data layer).
 * Day 1: in-memory only. Day 4: replaced with SQLite-backed repositories.
 *
 * @returns {{ posts: import('./posts.repo.js').PostsRepo }}
 */
export async function createRepos() {
  // Lazy import keeps this minimal for Day 1
  // (you can also use a direct import if you prefer).
  const { createPostsRepo } = await import('./posts.repo.js');

  return {
    posts: createPostsRepo(),
  };
}
