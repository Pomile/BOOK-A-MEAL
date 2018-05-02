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

  static modifyOrder(req, res) {
    const { orderId } = req.params;
    const {
      username, price, meal, date,
    } = req.body;

    const orderIndex = data.orders.findIndex(order => order.id === +orderId);
    if (orderIndex !== -1) {
      data.orders[orderIndex].username = username;
      data.orders[orderIndex].meal = meal;
      data.orders[orderIndex].price = price;
      data.orders[orderIndex].date = date;
      res.status(200).json({
        msg: `you have Change your Order from ${data.orders[orderIndex].meal} to ${meal}`,
        success: true,
      });
    } else {
      res.status(404).json({ msg: 'This Order does not exist', success: false });
    }
  }

  static getCustomerOrdersByName(req, res) {
    const { email } = req.user;
    const findOrdersByCustomerName = data.orders.map((order) => {
      if (order.username === email) {
        return order;
      }
      return null;
    });
    const customerOrders = findOrdersByCustomerName.filter(item => item !== null);
    if (customerOrders.length > 0) {
      res.status(200).json({ success: true, data: findOrdersByCustomerName });
    } else {
      res.status(404).json({ msg: 'Order history cannot be found', success: false });
    }
  }
}

export default Order;
