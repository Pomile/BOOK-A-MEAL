import { data } from '../db/data';
import { endianness } from 'os';

class MenuCreator {
  static addAMenu(req, res) {
    const selectedMeals = req.body.meals;
    const menu = data.meals.map((meal) => {
      if (selectedMeals.indexOf(meal.id) === 1) {
        return null;
      }
      return meal;
    }).filter(item => item !== null);

    const date = new Date();
    const month = (date.getMonth() + 1).toString();
    const day = date.getDate().toString();
    const year = date.getFullYear().toString();
    const todaysDate = `${month}/${day}/${year}`;
    const menuLen = data.menus.length;

    // search if menu is already added for the day
    const searchTodaysMenu = data.menus.findIndex(currentmenu => currentmenu.date === todaysDate);
    if (searchTodaysMenu === -1) {
      data.menus.push({
        id: menuLen + 1,
        meals: menu,
        date: todaysDate,
      });
      res.status(201).json({ success: true, msg: 'menu added sucessfully' }).end();
    } else {
      res.status(409).json({ success: false, msg: 'menu already set for the day' }).end();
    }
  }
}
export default MenuCreator;