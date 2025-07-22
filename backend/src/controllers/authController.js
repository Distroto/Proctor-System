const bcrypt = require('bcryptjs');
const userStore = require('../auth/userStore');
const jwt = require('../auth/jwt');

exports.signup = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'Username and password required' });
  if (userStore.getUser(username)) return res.status(409).json({ error: 'User already exists' });
  const hashed = await bcrypt.hash(password, 8);
  const { sessionId } = userStore.createUser(username, hashed);
  const token = jwt.sign({ username, sessionId });
  res.json({ token, sessionId });
};

exports.login = async (req, res) => {
  const { username, password } = req.body;
  const user = userStore.getUser(username);
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ error: 'Invalid credentials' });
  const sessionId = userStore.getSessionId(username);
  const token = jwt.sign({ username, sessionId });
  res.json({ token, sessionId });
}; 