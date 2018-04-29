import { data } from '../db/data';

class MenuGetter {
  static getTodaysMenu(req, res) {
    const date = new Date();
    const month = (date.getMonth() + 1).toString();
    const day = date.getDate().toString();
    const year = date.getFullYear().toString();
    const todaysDate = `${month}/${day}/${year}`;
    const todaysMenuIndex = data.menus.findIndex(menu => menu.date === todaysDate);
    if (todaysMenuIndex !== -1) {
      const todaysMenu = data.menus.find(menu => menu.date === todaysDate);
      res.json({ data: todaysMenu, success: true });
    } else {
      res.status(404).json({ msg: 'menu not set for the day' });
    }
  }
}

export default MenuGetter;
