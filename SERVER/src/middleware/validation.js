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

exports.validateUserCrediential = [
  check('username', 'must be an email address')
    .isEmail(),

  check('password', 'passwords must be at least 5 chars long and contain one number')
    .isLength({ min: 5 })
    .matches(/\d/),
];

exports.mealValidator = [
  check('name', 'Meal name is required')
    .exists()
    .custom(value => value !== ''),

  check('price')
    .exists()
    .not()
    .isEmpty()
    .withMessage('Meal price is required')
    .toInt()
    .custom(value => value !== 0),

  check('quantity')
    .exists()
    .not()
    .isEmpty()
    .withMessage('Meal quantity is required')
    .toInt()
    .custom(value => value >= 1),

];


exports.validationApi = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() });
  } else {
    next();
  }
};

