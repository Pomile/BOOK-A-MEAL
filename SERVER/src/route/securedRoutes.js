import express from 'express';
import Users from '../controller/user';
import Meal from '../controller/meal';
import Menu from '../controller/menu';
import permit from '../middleware/permission';
import passwordEncryption from '../middleware/encryption';
import { sendMenuNotification } from '../middleware/notification';
import { verifyUser } from '../middleware/verification';
import { mealValidator, validationApi, validatePasswordReset } from '../middleware/validation';
import Order from '../controller/order';

const securedRoutes = express.Router();

securedRoutes.get(
  '/user/profile',
  verifyUser,
  Users.getUserProfile,
);

securedRoutes.put(
  '/user/profile',
  verifyUser,
  Users.updateUserProfile,
);

securedRoutes.put(
  '/user/reset-password',
  validatePasswordReset,
  validationApi,
  verifyUser,
  passwordEncryption,
  Users.resetPassword,
);

securedRoutes.put(
  '/user/grant-role',
  verifyUser,
  permit('admin'),
  Users.grantPriviledge,
);

securedRoutes.post(
  '/meals',
  mealValidator,
  validationApi,
  verifyUser,
  permit('caterer', 'admin'),
  Meal.addMeal,
);

securedRoutes.post(
  '/bulkmeals',
  verifyUser,
  permit('caterer', 'admin'),
  Meal.addMeals,
);

securedRoutes.put(
  '/meals/:mealId',
  mealValidator,
  validationApi,
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
  (req, res) => {
    if (req.query.date) {
      Order.getCustomersOrders(req, res);
    } else {
      Order.getCustomerOrders(req, res);
    }
  },

);

export default securedRoutes;
