import { data } from '../db/data';

class OrdersGetter {
  static getOrders(req, res) {
    const specifiedDate = req.query.date;
    const findOrdersByDate = data.orders.map((order) => {
      if (order.date === specifiedDate) {
        return order;
      }
      return null;
    }).filter(item => item !== null);
    if (findOrdersByDate.length > 0) {
      const sumTotalOfOrders = findOrdersByDate.reduce((sum, order) => sum + order.price, 0);
      console.log(sumTotalOfOrders);
      res.status(200).json({ data: findOrdersByDate, total: sumTotalOfOrders, success: true });
    } else {
      res.status(404).json({ msg: `No Order(s) is available for ${specifiedDate} `, success: false });
    }
  }
}

export default OrdersGetter;
