import express from 'express';
import Meal from '../controller/meal';
import permit from '../middleware/permission';

const securedRoutes = express.Router();

securedRoutes.post(
  '/meals',
  permit('caterer', 'admin'),
  Meal.addMeal,
);

securedRoutes.put(
  '/meals/:mealId',
  permit('caterer', 'admin'),
  Meal.modifyMeal,
);

securedRoutes.delete(
  '/meals/:mealId',
  permit('caterer', 'admin'),
  Meal.removeMeal,
);

export default securedRoutes;
