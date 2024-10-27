export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      console.log('Access denied: User role not authorized:', req.user.role);
      return res.status(403).json({ message: 'Access denied' });
    }
    next();
  };
};
