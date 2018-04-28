import bcrypt from 'bcrypt';


const saltRounds = 10;

const passwordEncryption = (req, res, next) => {
  const { password } = req.body;
  bcrypt.hash(password, saltRounds, (err, hash) => {
    // Store hash in your password DB.
    if (err) {
      res.json({ error: err });
    }
    req.body.password = hash;
    // console.log(req.body);
    next();
  });
};
export default passwordEncryption;
