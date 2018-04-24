

exports.verifyUser = (req, res, next) => {
  const authorized = req.headers.authorization;

  if (authorized) {
    req.user = userData;
    console.log(userData);
    next();
  } else {
    res.json(403).json({ sucess: false, msg: 'access denied' });
  }
};

