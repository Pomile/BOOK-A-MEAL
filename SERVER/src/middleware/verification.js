import { data } from '../db/data';

exports.verifyUser = (req, res, next) => {
  const authorized = req.headers.authorization;
  console.log(req.headers.user);
  const userData = data.users.find(user => user.id === Number(req.headers.user));
  if (authorized) {
    req.user = userData;
    console.log(userData);
    next();
  } else {
    res.json(403).json({ sucess: false, msg: 'access denied' });
  }
};

