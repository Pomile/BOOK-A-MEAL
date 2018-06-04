import moment from 'moment';
import { Orders, Meals, Users } from '../models';
// import { data } from '../db/data';

class Order {
  static async makeOrder(req, res) {
    const userId = req.user.id;
    const { mealId, quantity } = req.body;
    let qty = 0;
    const date = new Date();
    const todaysDate = date.toISOString();
    const meal = await Meals.findById(mealId).then((mealData) => {
      // console.log(JSON.stringify(mealData));
      qty = mealData.quantity;
      return mealData;
    });

    if (!meal || qty < quantity) {
      res.status(404).json({ msg: 'Available quantity exceeded' });
    } else {
      Orders.create({
        mealId,
        userId,
        quantity,
        date: todaysDate,
      }).then((order) => {
        // console.log(JSON.stringify(order));
        Meals.findById(mealId).then((orderedMeal) => {
          orderedMeal.decrement('quantity', { by: order.quantity });
        });
        res.status(201).json({ success: true, msg: `You have ordered for ${meal.name}`, data: order });
      }).catch((err) => {
        // console.log(err.message);
        res.status(409).json({ msg: 'Order not successful', success: false, error: err.message });
      });
    }
  }

  static async modifyOrder(req, res) {
    const { orderId } = req.params;
    const {
      mealId,
    } = req.body;
    // console.log(orderId);
    await Orders.findById(orderId).then((order) => {
      // console.log(JSON.stringify(order.time.toLocaleTimeString()));
      const orderTime = moment(Object.values(moment(order.time.toLocaleTimeString(), 'hh:mm:ss').toObject()));
      // const now = moment('2018-05-22T13:59:47.357');
      const now = moment(Object.values(moment().toObject()));
      const modifyOrderTimeLimit = now.diff(orderTime, 'minute');
      if (modifyOrderTimeLimit > 30) {
        res.status(200).json({ msg: 'Its Over 30 minutes you cannot change meal choice', success: false });
      } else {
        order.update({
          mealId,
        }).then(() => {
          res.status(200).json({ success: true });
        });
      }
    });
  }
  static getCustomerOrders(req, res) {
    const date = new Date();
    const todaysdate = date.toISOString();
    // console.log(todaysdate);
    const userId = req.user.id;
    // console.log(userId);
    Orders.findAll({
      where: {
        date: todaysdate,
        userId,
      },
      attributes: ['id', 'date'],
      include: [{
        model: Users,
        attributes: ['email'],

      }, {
        model: Meals,
        attributes: ['id', 'name', 'price', 'image'],
      }],
    }).then((customerOrders) => {
      // console.log(JSON.stringify(customerOrders));
      res.status(200).json({ success: true, data: customerOrders });
    });
  }

  static getCustomersOrders(req, res) {
    const date = new Date();
    const todaysdate = date.toISOString();
    // console.log(todaysdate);
    const roles = ['caterer', 'admin'];
    if (roles.includes(req.user.role)) {
      Orders.findAll({
        where: {
          date: todaysdate,
        },
        attributes: ['id', 'date', 'quantity'],
        include: [{
          model: Users,
          attributes: ['email'],

        }, {
          model: Meals,
          attributes: ['id', 'name', 'price', 'image'],
        }],
      }).then((customersOrders) => {
        const total = customersOrders.reduce((sum, order) =>
          sum + (order.quantity * order.Meal.price), 0);
        customersOrders.push({ total });
        // console.log(JSON.stringify(customersOrders));
        res.status(200).json({ success: true, data: customersOrders });
      });
    } else {
      res.status(403).json({ message: 'access denied', success: false });
    }
  }
}

export default Order;
