import express from 'express';
import { userValidator, validationApi, validateUserCrediential } from '../middleware/validation';
import User from '../controller/user';

const openRoutes = express.Router();

openRoutes.post(
  '/',
  userValidator,
  validationApi,
  User.addUser,
);

openRoutes.post(
  '/auth',
  validateUserCrediential,
  User.authenticate,
);


export default openRoutes;
