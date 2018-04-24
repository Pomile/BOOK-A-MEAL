import { data } from '../db/data';


class UserCreator {
  static addUser(req, res) {
    const initialUsersCount = data.users.length;
    const {
      firstname, lastname, email, sex, password, country,
    } = req.body;

    // find if existing account has a user name
    const findByEmail = data.users.find(user => user.email === email);
    // console.log(findByEmail);
    if (findByEmail === undefined) {
      data.users.push({
        firstname, lastname, email, sex, password, country,
      });
    } else {
      res.status(409).json({ msg: 'user already existed' });
    }

    const finalUsersCount = data.users.length;

    if (finalUsersCount > initialUsersCount) {
      res
        .status(201)
        .json({
          success: true,
          msg: 'users added successfully',
        });
    }
  }
}


export default UserCreator;
