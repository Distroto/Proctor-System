const users = {};
const { v4: uuidv4 } = require('uuid');

exports.createUser = (username, hashedPassword) => {
  if (users[username]) return null;
  const sessionId = uuidv4();
  users[username] = { password: hashedPassword, sessionId };
  return { username, sessionId };
};

exports.getUser = (username) => users[username] || null;

exports.getSessionId = (username) => users[username]?.sessionId; 