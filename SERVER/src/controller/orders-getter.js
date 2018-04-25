import { data } from '../db/data';

class OrdersGetter {
  static getOrders(req, res) {
    const specifiedDate = req.query.date;
    const findOrdersByDate = data.orders.map(order => order.date === specifiedDate);

    if (findOrdersByDate !== undefined) {
      const sumTotalOfOrders = findOrdersByDate.reduce((sum, order) => sum + order.price, 0);
      res.status(200).json({ data: findOrdersByDate, total: sumTotalOfOrders, success: true });
    } else {
      res.status(404).json({ msg: `No Order(s) is available for ${specifiedDate} ` });
    }
  }
}

export default OrdersGetter;
