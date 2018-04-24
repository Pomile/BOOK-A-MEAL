import express from 'express';
import MealCreator from '../controller/meal-creator';
import { data } from '../db/data';
// import MealRemover from '../controller/meal-remover';
// import MealModifier from '../controller/meal-modifier';
// import MealGetter from '../controller/meal-getter';
// import MealsGetter from '../controller/meals-getter';

import permit from '../middleware/permission';
import { verifyUser } from '../middleware/verification';

const securedRouter = express.Router();


securedRouter.post(
  '/meals',
  permit('caterer', 'admin'),
  MealCreator.addMeal,
);


export default securedRouter;
