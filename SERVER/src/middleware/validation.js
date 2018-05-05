import { check, validationResult } from 'express-validator/check';

exports.userValidator = [
  check('firstname', 'firstname is required')
    .exists()
    .trim()
    .custom(value => value !== ''),

  check('lastname')
    .exists()
    .not()
    .isEmpty()
    .withMessage('Lastname is required')
    .custom(value => value !== ''),

  check('email', 'must be an email address')
    .isEmail(),

  check('password', 'passwords must be at least 5 chars long and contain one number')
    .isLength({ min: 5 })
    .matches(/\d/)
    .custom((value, { req }) => value === req.body.cpassword),

];

exports.validationApi = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() });
  } else {
    next();
  }
};

exports.validateUserCrediential = [
  check('username', 'must be an email address')
    .isEmail(),

  check('password', 'passwords must be at least 5 chars long and contain one number')
    .isLength({ min: 5 })
    .matches(/\d/),
];