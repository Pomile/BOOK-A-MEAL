import { Orders, Meals } from '../models';
import { data } from '../db/data';

class Order {
  static makeOrder(req, res) {
    const userId = req.user.id;
    const { mealId, quantity } = req.body;

    const date = new Date();
    const todaysDate = date.toISOString();
    const meal = Meals.findById(mealId);

    if (!meal) {
      res.status(404).json({ msg: 'Meal not found' });
    } else if (meal.quantity < quantity) {
      res.status(200).json({ msg: 'Meal quantity exceeded' });
    } else {
      Orders.create({
        mealId,
        userId,
        quantity,
        date: todaysDate,
      }).then((order) => {
        console.log(JSON.stringify(order));
        res.status(201).json({ success: true, msg: `You have ordered for ${meal.name}` });
      }).catch((err) => {
        console.log(err.message);
        res.status(409).json({ msg: 'Order not successful', success: false });
      });
    }
    // find selected meal in the menu
    /*  const todaysMenu = data.menus.map(menu => (menu.date === todaysDate ? menu : null));

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
    } */
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
  static getAllCustomersOrder(req, res) {
    const specifiedDate = req.query.date;
    const findOrdersByDate = data.orders.map((order) => {
      if (order.date === specifiedDate) {
        return order;
      }
      return null;
    }).filter(item => item !== null);
    if (findOrdersByDate.length > 0) {
      const sumTotalOfOrders = findOrdersByDate.reduce((sum, order) => sum + order.price, 0);
      res.status(200).json({ data: findOrdersByDate, total: sumTotalOfOrders, success: true });
    } else {
      res.status(404).json({ msg: `No Order(s) is available for ${specifiedDate} `, success: false });
    }
  }
}

export default Order;
