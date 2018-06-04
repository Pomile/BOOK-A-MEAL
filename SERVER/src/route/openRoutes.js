import express from 'express';
import { userValidator, validationApi, validateUserCrediential } from '../middleware/validation';
import User from '../controller/user';

const openRoutes = express.Router();

openRoutes.post(
  '/auth/signup',
  userValidator,
  validationApi,
  User.addUser,
);

openRoutes.post(
  '/auth/signin',
  validateUserCrediential,
  User.authenticate,
);

openRoutes.get(
  '/auth/email-confirmation',
  User.verifyUserEmail,
);


export default openRoutes;
