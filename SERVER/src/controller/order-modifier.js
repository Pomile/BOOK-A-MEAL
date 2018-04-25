import { data } from '../db/data';

class OrderModifier {
  static modifyAnOrder(req, res) {
    const { orderId } = req.params;
    const {
      username, price, meal, date,
    } = req.body;

    const orderIndex = data.orders.findIndex(order => order.id === +orderId);
    const orderUserName = data.orders[orderIndex].username;
    if (orderIndex !== -1 && orderUserName === username) {
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
}

export default OrderModifier;
