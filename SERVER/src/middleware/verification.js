
import jwt from 'jsonwebtoken';
import { Users } from '../models';

exports.verifyUser = (req, res, next) => {
  const payload = req.headers.authorization || req.headers['x-access-token'];
  // console.log(`authorization: ${payload}`);
  if (payload !== undefined) {
    jwt.verify(payload, 'ijiugsghuyqqgbnnzxhuhuq', (err, decoded) => {
      if (err) {
        res.status(403).send({
          success: false,
          err: 'access denied, invalid token',
          errMsg: err.message,
        });
      }
      // console.log(decoded.data);
      Users.findById(decoded.data).then((user) => {
        // console.log(user.role);
        req.user = user;
        next();
      }).catch(error => res.status(404).send({
        success: false,
        message: 'user not found',
        error: error.message,
      }));
    });
  } else {
    res.status(403).send({
      success: false,
      err: 'access denied',
    });
  }
};

