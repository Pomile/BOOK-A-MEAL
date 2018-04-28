import bcrypt from 'bcrypt';
import { data } from '../db/data';

class UserAuthenticator {
  static Authenticate(req, res) {
    const { username, password } = req.body;
    const userData = data.users.find(user => user.email === username);
    if (userData === undefined) {
      res.status(404).json({ msg: 'user not found' });
    } else {
      const hash = userData.password;
      bcrypt.compare(password, hash, (err, result) => {
        if (result) {
          res.status(200).json({ sucess: true, msg: 'user logged in sucessfully', isAuth: true });
        } else {
          res.status(401).json({ sucess: false, msg: 'password mismatch' });
        }
      });
    }
  }
}
export default UserAuthenticator;
