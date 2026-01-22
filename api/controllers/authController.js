const asyncHandler = require('../utils/asyncHandler');
const { findUserByEmail, verifyPassword } = require('../services/authService');
const { signToken } = require('../utils/jwt');

// POST /api/v1/auth/login
// Body: { email, password }
// Uses table: users (password_hash), roles
exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ message: 'email and password are required' });
  }
  const user = await findUserByEmail(email);
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });
  const ok = await verifyPassword(password, user.password_hash);
  if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

  const token = signToken({ id: user.id, role: user.role, role_id: user.role_id });
  res.json({
    token,
    user: {
      id: user.id,
      full_name: user.full_name,
      email: user.email,
      role: user.role,
      role_id: user.role_id,
    },
  });
});
