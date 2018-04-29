import { data } from '../db/data';

exports.verifyUser = (req, res, next) => {
  const authorized = req.headers.authorization;
  const userId = req.headers.user;
  if (authorized === 'false') {
    res.status(403).json({ msg: 'user not authentic' });
  } else {
    const userData = data.users.find(user => user.id === Number(userId));
    req.user = userData;
    next();
  }
};

