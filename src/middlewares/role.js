// src/middlewares/role.js
module.exports = (requiredRole) => {
    return (req, res, next) => {
      // Assume req.user is populated by your auth middleware
      if (!req.user || req.user.role !== requiredRole) {
        return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
      }
      next();
    };
  };
  