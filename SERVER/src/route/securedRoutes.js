import express from 'express';
import Meal from '../controller/meal';
import permit from '../middleware/permission';

const securedRoutes = express.Router();

securedRoutes.post(
  '/meals',
  permit('caterer', 'admin'),
  Meal.addMeal,
);

export default securedRoutes;
