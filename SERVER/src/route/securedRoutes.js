import express from 'express';
import Meal from '../controller/meal';
import Menu from '../controller/menu';
import permit from '../middleware/permission';
import { sendMenuNotification } from '../middleware/notification';
import { verifyUser } from '../middleware/verification';
import { mealValidator } from '../middleware/validation';
import Order from '../controller/order';

const securedRoutes = express.Router();

securedRoutes.post(
  '/meals',
  mealValidator,
  verifyUser,
  permit('caterer', 'admin'),
  Meal.addMeal,
);

securedRoutes.put(
  '/meals/:mealId',
  mealValidator,
  verifyUser,
  permit('caterer', 'admin'),
  Meal.modifyMeal,
);

securedRoutes.delete(
  '/meals/:mealId',
  verifyUser,
  permit('caterer', 'admin'),
  Meal.removeMeal,
);

securedRoutes.get(
  '/meals',
  verifyUser,
  Meal.getMeals,
);

securedRoutes.post(
  '/menus',
  verifyUser,
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

securedRoutes.put(
  '/orders/:orderId',
  verifyUser,
  Order.modifyOrder,
);
securedRoutes.get(
  '/orders',
  verifyUser,
  Order.getCustomerOrders,
);
export default securedRoutes;
