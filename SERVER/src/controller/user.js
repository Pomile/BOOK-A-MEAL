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

  static getUserProfile(req, res) {
    const {
      firstname, lastname, email, role, image,
    } = req.user;
    res.status(200).json({
      data: {
        firstname, lastname, role, email, image,
      },
      success: true,
    });
  }

  static updateUserProfile(req, res) {
    const {
      firstname, lastname, email,
    } = req.body;
    const { id } = req.user;
    const image = req.files.image.data;

    Users.findById(id).then(user => user.update({
      firstname,
      lastname,
      email,
      image,
    })).then(updatedUser => res.status(200)
      .json({ success: true, data: updatedUser }))
      .catch((err) => {
        res.status(404)
          .json({ msg: 'user does not exist', error: err.message })
          .end();
      });
  }

  static verifyUserEmail(req, res) {
    const { email } = req.body;
    Users.findOne({
      where: {
        email,
      },
    }).then((user) => {
      const payload = user.id;
      const token = jwt.sign({ data: payload }, 'ijiugsghuyqqgbnnzxhuhuq', { expiresIn: '24h' });
      return res.status(200).json({ token, isValid: true });
    }).catch(err => res.status(404).json({ isValid: false, error: err.message }));
  }

  static resetPassword(req, res) {
    const { password } = req.body;
    const { id } = req.user;
    Users.findOne({ where: { id } })
      .then(user => user.update({
        password,
      })
        .then(() => res.status(200).json({ success: true, isPasswordUpdated: true })))
      .catch(err => res.status(500)
        .json({ msg: 'something went wrong', error: err.message, isPasswordUpdated: false }));
  }

  static grantPriviledge(req, res) {
    const { role, email } = req.body;
    Users.findOne({
      where: {
        email,
      },
    }).then(user => user.update({
      firstname: user.firstname,
      lastname: user.lastname,
      email,
      role,
    })).then(() => res.status(200).json({ msg: 'Priviledge granted', success: true }))
      .catch(err => res.status(404).json({ msg: 'user not found', error: err.message }));
  }

  static async authenticate(req, res) {
    const {
      email, password,
    } = req.body;

    const user = await Users.findOne({ where: { email } });
    if (!user) {
      res.status(404).json({ msg: 'user not found', success: false });
    } else {
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
    }
  }
}
export default User;
