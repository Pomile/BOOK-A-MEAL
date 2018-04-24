exports.verifyUser = (req, res, next) => {
  const authorized = req.headers.Authorization;
  if (authorized) {
    next();
  } else {
    res.json(403).json({ sucess: false, msg: 'access denied' });
  }
};

