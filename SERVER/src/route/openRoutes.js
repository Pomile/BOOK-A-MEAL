import express from 'express';
import { userValidator, validationApi, validateUserCrediential } from '../middleware/validation';
import passwordEncryption from '../middleware/encryption';
import User from '../controller/user';

const openRoutes = express.Router();

openRoutes.post(
  '/',
  userValidator,
  validationApi,
  passwordEncryption,
  User.addUser,
);

openRoutes.post(
  '/auth',
  validateUserCrediential,
  User.authenticate,
);


export default openRoutes;
