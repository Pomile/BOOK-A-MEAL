import express from 'express';
import { userValidator, validationApi, validateUserCrediential } from '../middleware/validation';
import passwordEncryption from '../middleware/encryption';
import UserCreator from '../controller/user-creator';
import userAuth from '../controller/user-auth';

const router = express.Router();

router.get('/', (req, res) => {
  res.send('You are Welcome. Please Book a Meal');
});

router.post(
  '/',
  userValidator,
  validationApi,
  passwordEncryption,
  UserCreator.addUser,
);

router.post(
  '/auth',
  validateUserCrediential,
  userAuth.Authenticate,
);

export default router;
