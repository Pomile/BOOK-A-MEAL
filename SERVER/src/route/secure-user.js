import express from 'express';
import MealCreator from '../controller/meal-creator';
import MealRemover from '../controller/meal-remover';
import MealModifier from '../controller/meal-modifier';
// import MealGetter from '../controller/meal-getter';
import MealsGetter from '../controller/meals-getter';
import MenuCreator from '../controller/menu-creator';

import permit from '../middleware/permission';
import { verifyUser } from '../middleware/verification';

const securedRouter = express.Router();


securedRouter.post(
  '/meals',
  permit('caterer', 'admin'),
  MealCreator.addMeal,
);

securedRouter.put(
  '/meals/:mealId',
  permit('caterer', 'admin'),
  MealModifier.modifyAMeal,
);

securedRouter.delete(
  '/meals/:mealId',
  permit('caterer', 'admin'),
  MealRemover.deleteAMeal,
);

securedRouter.get(
  '/meals',
  permit('caterer', 'admin'),
  MealsGetter.getMeals,
);

securedRouter.post(
  '/menus',
  permit('caterer', 'admin'),
  MenuCreator.addAMenu,

);


export default securedRouter;