const jwt = require('jsonwebtoken');
const env = require('../config/env');

function signToken(user) {
  return jwt.sign(
    { sub: user.id, role: user.role, role_id: user.role_id },
    env.jwt.secret,
    { expiresIn: env.jwt.expiresIn }
  );
}

module.exports = { signToken };
