import { Meals, MealMenus, Menus } from '../models';
import { googleAuth } from '../middleware/notification';

class Menu {
  static async setMenu(req, res) {
    const { meals, title } = req.body;
    const userId = req.user.id;
    const date = new Date();
    const todaysDate = date.toISOString();
    const availableMeals = await Meals.findAll({
      where: {
        id: { $in: meals }, quantity: { $gte: 1 },
      },
    });
    if (availableMeals.length === 0 || availableMeals.isFulfilled === false) {
      return res.status(404).json({ msg: 'meals are not available', success: false });
    }
    const menu = await Menus.create({ userId, title, date: todaysDate })
      .then(todaysmenu => todaysmenu)
      .catch(err => ({ result: null, msg: err.message }));

    if (menu.result === null) {
      return res.status(409).json({ success: false, msg: 'menu already set for the day' });
    }
    const menuMeals = [];
    await availableMeals.map(mx => menuMeals.push({ mealId: mx.id, menuId: menu.id }));
    return MealMenus.bulkCreate(menuMeals).then(() => googleAuth(req, res));
  }
  static getTodaysMenu(req, res) {
    const date = new Date();
    const todaysDate = date.toISOString();
    Menus.findOne({
      where: {
        date: todaysDate,
      },
    }).then(menu =>
      MealMenus.findAll({
        where: { menuId: menu.id },
        include: [{
          model: Meals,
          attributes: ['id', 'name', 'price', 'quantity', 'image'],
        }],
      })).then(meals => res.status(200).json({ data: meals, success: true })
      .end()).catch((err) => { res.status(404).json({ error: err.message }); });
  }
}
export default Menu;
