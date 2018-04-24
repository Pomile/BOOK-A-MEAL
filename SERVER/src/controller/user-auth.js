import bcrypt from 'bcrypt';
import 'babel-core/register';
import 'babel-polyfill/';
import { data } from '../db/data';


class UserAuthenticator {
  static async Authenticate(req, res) {
    const {
      username, password,
    } = req.body;
    // console.log(data.users);
    const userData = await data.users.find(user => user.email === username);
    if (userData === undefined) {
      res.status(404).json({ msg: 'user not found' });
    } else {
      const hash = userData.password;
      bcrypt.compare(password, hash, (err, result) => {
        // res == true
        if (result) {
          res.status(200).json({
            sucess: true, msg: 'user logged in sucessfully', isAuth: true, user: userData.id,
          });
        } else {
          res.status(401).json({ sucess: false, msg: 'password mismatch' });
        }
      });
    }
  }
}


export default UserAuthenticator;
