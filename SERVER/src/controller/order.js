import { data } from '../db/data';

class Order {
  static makeOrder(req, res) {
    const { email, firstname } = req.user;
    const { mealId } = req.body;
    const countOrders = data.orders.length;

    const date = new Date();
    const month = (date.getMonth() + 1).toString();
    const day = date.getDate().toString();
    const year = date.getFullYear().toString();
    const todaysDate = `${month}/${day}/${year}`;

    // find selected meal in the menu
    const todaysMenu = data.menus.map(menu => (menu.date === todaysDate ? menu : null));

    const mealsOption = todaysMenu[0].meals;

    const selectedMeal = mealsOption.find(meal => meal.id === mealId);

    if (selectedMeal !== undefined) {
      const { name, price } = selectedMeal;
      data.orders.push({
        id: countOrders + 1,
        username: email,
        meal: name,
        price,
        date: todaysDate,
      });
      res.status(201)
        .json({ msg: `Thank you ${firstname}. you have ordered for ${name}`, success: true })
        .end();
    } else {
      res.status(404).json({ msg: 'This Meal is not available' }).end();
    }
  }
}

export default Order;
