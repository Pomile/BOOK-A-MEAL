import { Meals, MealMenus, Menus } from '../models';
// import { data } from '../db/data';


class Menu {
  static async setMenu(req, res) {
    const { meals, title } = req.body;
    const userId = req.user.id;
    const date = new Date();
    const todaysDate = date.toISOString();
    const availableMeals = await Meals.findAll({
      where: {
        id: {
          $in: meals,
        },
        quantity: {
          $gte: 1,
        },
      },
    });
    if (availableMeals.length === 0) {
      res.status(404).json({ msg: 'meal is not available', success: false });
    } else {
      const menu = await Menus.create({
        userId,
        title,
        date: todaysDate,
      }).then(todaysmenu => todaysmenu);
      const menuMeals = [];
      await availableMeals.map(mx => menuMeals.push({ mealId: mx.id, menuId: menu.id }));
      await MealMenus.bulkCreate(menuMeals).then((mealMenu) => {
        // console.log(JSON.stringify(mealMenu));
        res.status(201).json({ success: true, data: mealMenu });
      });
    }
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
          attributes: ['name', 'price', 'image'],
        }],
      })).then((meals) => {
      console.log(JSON.stringify(meals));
      res.status(200).json({ data: meals, success: true })
        .end();
    }).catch((err) => { res.status(404).json({ error: err.message }); });
  }
}
export default Menu;
