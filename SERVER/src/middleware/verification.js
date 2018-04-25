import { data } from '../db/data';

exports.verifyUser = (req, res, next) => {
  const userData = data.users.find(user => user.id === Number(req.headers.user));
  const authorized = req.headers.authorization;
  if (authorized) {
    req.user = userData;
    next();
  } else {
    res.json(403).json({ sucess: false, msg: 'access denied' });
  }
};

