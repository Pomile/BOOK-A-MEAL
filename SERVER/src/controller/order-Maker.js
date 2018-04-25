import { data } from '../db/data';

class OrderMaker {
  static makeOrder(req, res) {
    const { email, firstname } = req.user;
    const { mealId } = req.body;
    const countOrders = data.orders.length;

    const date = new Date();
    const month = (date.getMonth() + 1).toString();
    const day = date.getDate().toString();
    const year = date.getFullYear().toString();
    const todaysDate = `${month}/${day}/${year}`;

    // find selected meal the menu
    const selectedMeal = data.menus.find(meal => meal.id === mealId);
    const { price, name } = selectedMeal;
    if (selectedMeal) {
      data.orders.push({
        id: countOrders + 1,
        username: email,
        meal: name,
        price,
        date: todaysDate,
      });
      res.status(201).json({ msg: `Thank you ${firstname}. you have ordered for ${name}`, success: true });
    } else {
      res.status(404).json({ msg: `This Meal ${name} is not available` });
    }
  }
}

export default OrderMaker;
