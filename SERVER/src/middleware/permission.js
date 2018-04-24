import { data } from '../db/data';

const permit = (...permited) => {
  const isPermited = role => permited.indexOf(role) > -1;
  return (req, res, next) => {
    const userData = data.users.find(user => user.id === Number(req.headers.user));
    if (req.headers.authorization && isPermited(userData.role)) {
      next();
    } else {
      res.status(403).json({ message: 'Forbidden' });
    }
  };
};


export default permit;
