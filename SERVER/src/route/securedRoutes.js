import express from 'express';
import Meal from '../controller/meal';
import Menu from '../controller/menu';
import permit from '../middleware/permission';
import { sendMenuNotification } from '../middleware/notification';
import { verifyUser } from '../middleware/verification';
import Order from '../controller/order';

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

securedRoutes.get(
  '/meals',
  permit('caterer', 'admin'),
  Meal.getMeals,
);

securedRoutes.post(
  '/menus',
  permit('caterer', 'admin'),
  Menu.setMenu,
  sendMenuNotification,
);

securedRoutes.get(
  '/menu',
  verifyUser,
  Menu.getTodaysMenu,

);

securedRoutes.post(
  '/orders',
  verifyUser,
  Order.makeOrder,
);


export default securedRoutes;
