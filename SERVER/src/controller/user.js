import bcrypt from 'bcrypt';
// import { data } from '../db/data';
import { Users } from '../models';


class User {
  static addUser(req, res) {
    // const initialUsersCount = data.users.length;
    console.log(req.body.firstname);
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
    // console.log(user.get({plain: true }))
      res.status(201).send({
        success: true,
        msg: 'User added successfully',
        data: user,
      })).catch(error =>
      // console.log(`${error.message}/n${error.stack}`);
      res.status(409).send({
        success: false,
        msg: 'user already exists',
        err: error.message,
      }));
  }

  static authenticate(req, res) {
    const {
      username, password,
    } = req.body;
    const userData = data.users.find(user => user.email === username);
    if (userData === undefined) {
      res.status(404).json({ msg: 'user not found' });
    } else {
      const hash = userData.password;
      bcrypt.compare(password, hash, (err, result) => {
        if (result) {
          res.status(200).json({
            sucess: true, msg: 'user logged in sucessfully', isAuth: true, user: userData.id,
          });
        } else {
          res.status(401).json({ sucess: false, msg: 'invalid password' });
        }
      });
    }
  }
}
export default User;
