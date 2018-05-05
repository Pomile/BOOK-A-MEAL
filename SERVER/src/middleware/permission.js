
const permit = (...permited) => (req, res, next) => {
  const userRole = req.user.role;
  if (permited.indexOf(userRole) !== -1) {
    next();
  } else {
    res.status(403).json({ message: 'access denied' });
  }
};
export default permit;
