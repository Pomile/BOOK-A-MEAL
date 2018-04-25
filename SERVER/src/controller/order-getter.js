import { data } from '../db/data';

class OrderGetter {
  static getOrder(req, res) {
    // console.log(req.user);
    const { email } = req.user;
    const findOrdersByCustomerName = data.orders.map((order) => {
      if (order.username === email) {
        return order;
      }
      return null;
    })
      .filter(item => item !== null);

    if (findOrdersByCustomerName) {
      console.log(findOrdersByCustomerName);
      res.status(200).json({ success: true, data: findOrdersByCustomerName });
    } else {
      res.status(404).json({ msg: 'Order history cannot be found' });
    }
  }
}


export default OrderGetter;
