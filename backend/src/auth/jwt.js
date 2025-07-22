const jwt = require('jsonwebtoken');

const SECRET = 'proctor-secret'; 
const EXPIRES_IN = '2h';

exports.sign = (payload) => jwt.sign(payload, SECRET, { expiresIn: EXPIRES_IN });
exports.verify = (token) => jwt.verify(token, SECRET); 