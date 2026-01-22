function authorize(allowedRoles = []) {
  const set = new Set(allowedRoles);
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    if (set.size === 0 || set.has(req.user.role)) {
      return next();
    }
    return res.status(403).json({ message: 'Forbidden' });
  };
}

module.exports = authorize;
