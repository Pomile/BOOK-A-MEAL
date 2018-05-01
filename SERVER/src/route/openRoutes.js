import express from 'express';
import { userValidator, validationApi } from '../middleware/validation';
import passwordEncryption from '../middleware/encryption';
import User from '../controller/user';

const router = express.Router();

router.post(
  '/',
  userValidator,
  validationApi,
  passwordEncryption,
  User.addUser,
);

export default router;
