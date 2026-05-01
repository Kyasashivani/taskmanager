// In-memory user store for fallback authentication (when MongoDB is unavailable)
const users = new Map();
let idCounter = 1;

module.exports = {
  // Mock create user
  createUser: async (userData) => {
    const id = String(idCounter++);
    const user = {
      _id: id,
      id: id,
      ...userData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    users.set(id, user);
    users.set(userData.email, user); // Index by email too
    return user;
  },

  // Mock find user by email
  findUserByEmail: async (email) => {
    return users.get(email) || null;
  },

  // Mock find user by id
  findUserById: async (id) => {
    return users.get(id) || null;
  },

  // Check if user exists
  userExists: async (email) => {
    return users.has(email);
  },
};
