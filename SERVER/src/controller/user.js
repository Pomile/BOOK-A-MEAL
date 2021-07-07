import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import 'babel-polyfill';
// import { data } from '../db/data';
import { Users } from '../models';


class User {
  static addUser(req, res) {
    const {
      firstname,
      lastname,
      email,
      password,
      role,
    } = req.body;

    Users.create({
      firstname,
      lastname,
      email,
      password,
      role,
    }).then(user =>
      res.status(201).send({
        success: true,
        msg: 'User added successfully',
        data: user,
      })).catch(error =>
      res.status(409).send({
        success: false,
        msg: 'user already exists',
        err: error.message,
      }));
  }

  static async authenticate(req, res) {
    const {
      email, password,
    } = req.body;
    Users.find({ where: { email } }).then((user) => {
      const hash = user.password;
      bcrypt.compare(password, hash, (err, response) => {
        if (response === true) {
          const payload = user.id;
          const token = jwt.sign({ data: payload }, 'ijiugsghuyqqgbnnzxhuhuq', { expiresIn: '24h' });
          res.status(200)
            .json({
              success: true,
              msg: 'user logged in sucessfully',
              auth: token,
            }).end();
        } else {
          res.status(401).send({
            success: false,
            msg: 'invalid password',
          }).end();
        }
      });
    }).catch((err) => {
      res.status(404).send({
        success: false,
        msg: 'user not found',
        error: err.message,
      }).end();
    });
  }
}
export default User;
