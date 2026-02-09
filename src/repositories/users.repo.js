/**
 * Day 3: in-memory users.
 *
 * @typedef {{ id: number, email: string, name: string, passwordHash: string }} User
 */
export function createUsersRepo() {
  /** @type {User[]} */
  const users = [];
  let nextId = 1;

  return {
    /**
     * @param {{ email: string, name: string, passwordHash: string }} data
     * @returns {User}
     */
    create(data) {
      const user = { id: nextId++, ...data };
      users.push(user);
      return user;
    },

    /**
     * @param {string} email
     * @returns {User|null}
     */
    findByEmail(email) {
      return users.find((u) => u.email === email) ?? null;
    },

    /**
     * @param {number} id
     * @returns {User|null}
     */
    findById(id) {
      return users.find((u) => u.id === id) ?? null;
    },
  };
}