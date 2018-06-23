import jwt from 'jsonwebtoken';
import { Users } from '../models';

exports.verifyUser = (req, res, next) => {
  const payload = req.headers.authorization || req.headers['x-access-token'];
  if (payload !== undefined) {
    jwt.verify(payload, 'ijiugsghuyqqgbnnzxhuhuq', async (err, decoded) => {
      if (err) {
        res.status(403).send({
          success: false, err: 'access denied, invalid token', errMsg: err.message,
        });
      } else {
        const user = await Users.findOne({ where: { id: decoded.data } });
        if (!user) {
          res.status(404).send({ success: false, message: 'user not found' });
        } else {
          req.user = user;
          next();
        }
      }
    });
  } else {
    res.status(403).send({ success: false, err: 'access denied' });
  }
};
