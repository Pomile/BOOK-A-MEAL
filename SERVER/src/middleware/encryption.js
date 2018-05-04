import bcrypt from 'bcrypt';

const saltRounds = 10;

const passwordEncryption = (user) => {
  // const { password } = req.body;
  bcrypt.hash(user.password, saltRounds, (err, hash) => {
    // Store hash in your password DB.
    user.password = hash;
    // console.log(req.body);
    // next();
  });
};

export default passwordEncryption;
