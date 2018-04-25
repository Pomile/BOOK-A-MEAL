import { data } from '../db/data';

const permit = (...permited) => (req, res, next) => {
  const userData = data.users.find(user => user.id === Number(req.headers.user));
  const userRole = userData.role;
  const authorized = req.headers.authorization;
  if (authorized === 'true' && permited.indexOf(userRole) !== -1) {
    next();
  } else {
    res.status(403).json({ message: 'access deined' });
  }
};


export default permit;
