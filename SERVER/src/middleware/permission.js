const permit = (...permited) => {
  const isPermited = role => permited.indexOf(role) > -1;
  return (req, res, next) => {
    if (req.isAuthentic && isPermited(req.user.role)) {
      next();
    } else {
      res.status(403).json({ message: 'Forbidden' });
    }
  };
};
export default permit;
