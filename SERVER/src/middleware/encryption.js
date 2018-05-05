import bcrypt from 'bcrypt';

const saltRounds = 10;

const passwordEncryption = (req, res, next) => {
  const { password } = req.body;
  bcrypt.hash(password, saltRounds, (err, hash) => {
    req.body.password = hash;
    next();
  });
};
export default passwordEncryption;
