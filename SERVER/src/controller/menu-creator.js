import { data } from '../db/data';

class MenuCreator {
  static addAMenu(req, res) {
    const selectedMeals = req.body.meals;
    // console.log(selectedMeals);
    const menu = data.meals.map((meal) => {
      if (selectedMeals.includes(meal.id)) {
        return meal;
      }
      return null;
    }).filter(item => item !== null);
    // console.log(data.meals);
    // console.log(menu);

    const date = new Date();
    const month = (date.getMonth() + 1).toString();
    const day = date.getDate().toString();
    const year = date.getFullYear().toString();
    const todaysDate = `${month}/${day}/${year}`;
    const menuLen = data.menus.length;
    // search if menu is already added for the day

    const searchTodaysMenu = data.menus.findIndex(currentmenu => currentmenu.date === todaysDate);
    // console.log(`index exist or not: ${searchTodaysMenu}`);
    if (searchTodaysMenu === -1) {
      data.menus.push({
        id: menuLen + 1,
        meals: menu,
        date: todaysDate,
      });
      res.status(201).json({ success: true, msg: 'menu added sucessfully' });
    } else {
      res.status(409).json({ success: false, msg: 'menu already set for the day' });
    }
  }
}

export default MenuCreator;
