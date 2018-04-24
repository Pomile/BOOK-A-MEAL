

const permit = (permited) => {
  const isPermited = role => permited.include(role);
  return (req, res, next) => {
    if (req.headers.authorization && isPermited(req.user.role)) {
      console.log(req.user);
      next();
    } else {
      res.status(403).json({ message: 'Forbidden' });
    }
  };
};


export default permit;
