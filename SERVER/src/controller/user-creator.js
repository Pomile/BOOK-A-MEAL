import { data } from '../db/data';


class UserCreator {
  static addUser(req, res) {
    const initialUsersCount = data.users.length;
    const {
      firstname, lastname, email, sex, password, country, role,
    } = req.body;

    const userId = initialUsersCount + 1;
    // find if existing account has a user name
    const findByEmail = data.users.find(user => user.email === email);

    if (findByEmail === undefined) {
      data.users.push({
        id: userId, firstname, lastname, email, sex, password, country, role,
      });
    } else {
      res.status(409).json({ msg: 'user already existing' });
    }

    const finalUsersCount = data.users.length;

    if (finalUsersCount > initialUsersCount) {
      res
        .status(201)
        .json({
          success: true,
          user: userId,
          msg: 'users added successfully',
        });
    }
  }
}


export default UserCreator;
