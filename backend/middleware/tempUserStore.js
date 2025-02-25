// utils/tempUserStore.js

// Store temporary user data in memory (not for production use)
// Consider using a more persistent storage solution in production

const tempUserStore = new Map();

const storeTempUser = (req, userData) => {
  // Use the session ID as the key to store user data
  const sessionId = req.sessionID;
  tempUserStore.set(sessionId, userData);
};

const getTempUser = (req) => {
  const sessionId = req.sessionID;
  return tempUserStore.get(sessionId);
};

const clearTempUser = (req) => {
  const sessionId = req.sessionID;
  tempUserStore.delete(sessionId);
};

export default {
  storeTempUser,
  getTempUser,
  clearTempUser,
};
