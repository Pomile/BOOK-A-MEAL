import mocha from 'mocha';
import chai from 'chai';
import 'babel-polyfill';
import request from 'supertest';
import app from '../server';
import { Users, Meals, MealMenus, Menus, Orders } from '../src/models';

const {
  describe, it, after,
} = mocha;
const expect = chai.expect;

let adminToken;
let customerToken;

describe('BOOK-A-MEAL API TEST SUITE', () => {
  after(async () => {
    console.log(`adminPass: ${adminToken}`);
    console.log(`customerPass: ${customerToken}`);


    await Users.sync({ force: true }).then(() => {
      console.log('Users table dropped and created');
    }).catch(err => console.log(err.message));

    await Meals.sync({ force: true }).then(() => {
      console.log('Meals table dropped and created');
    }).catch(err => console.log(err.message));

    await Menus.sync({ force: true }).then(() => {
      console.log('Menus table dropped and created');
    }).catch(err => console.log(err.message));

    await Orders.sync({ force: true }).then(() => {
      console.log('Orders table dropped and created');
    }).catch(err => console.log(err.message));

    await MealMenus.sync({ force: true }).then(() => {
      console.log('MealMenus table dropped and created');
    }).catch(err => console.log(err.message));
  });
  describe('Users API', () => {
    it('Caterer should be able to create an account', (done) => {
      const userData = {
        firstname: 'babatunde',
        lastname: 'ogedengbe',
        email: 'softsky@live.com',
        password: 'testing123',
        cpassword: 'testing123',
        role: 'caterer',
      };
      request(app)
        .post('/api/v1/users/auth/signup')
        .set('Accept', 'application/json')
        .send(userData)
        .end((err, res) => {
          expect(res.status).to.equal(201);
          expect(res.body.msg).to.equal('User added successfully');
          done();
        });
    });

    it('user should be able to create an account', (done) => {
      const userData = {
        firstname: 'Bolanle',
        lastname: 'Muritala',
        email: 'bola.kudi@live.com',
        password: 'moneyspeaking123',
        cpassword: 'moneyspeaking123',
        role: 'user',
      };
      request(app)
        .post('/api/v1/users/auth/signup')
        .set('Accept', 'application/json')
        .send(userData)
        .end((err, res) => {
          expect(res.status).to.equal(201);
          expect(res.body.msg).to.equal('User added successfully');
          done();
        });
    });

    it('should not create an existing account', (done) => {
      const userData = {
        firstname: 'Bolanle',
        lastname: 'Muritala',
        email: 'bola.kudi@live.com',
        password: 'moneyspeaking123',
        cpassword: 'moneyspeaking123',
        role: 'user',
      };
      request(app)
        .post('/api/v1/users/auth/signup')
        .set('Accept', 'application/json')
        .send(userData)
        .end((err, res) => {
          expect(res.status).to.equal(409);
          expect(res.body.msg).to.equal('user already exists');
          done();
        });
    });
    it('should not create an account without firstname', (done) => {
      const userData = {
        firstname: '',
        lastname: 'Olusegun',
        username: 'segun',
        email: 'olusegun@live.com',
        password: 'warlord123',
        cpassword: 'warlod123',
        role: 'user',
      };
      request(app)
        .post('/api/v1/users/auth/signup')
        .set('Accept', 'application/json')
        .send(userData)
        .end((err, res) => {
          expect(userData).to.have.property('firstname');
          expect(userData).to.have.property('lastname');
          expect(userData).to.have.property('username');
          expect(userData).to.have.property('email');
          expect(userData).to.have.property('password');
          expect(userData).to.have.property('cpassword');
          // console.log(res.body);
          expect(res.body.errors[0].msg).to.equal('firstname is required');
          expect(res.status).to.equal(422);
          done();
        });
    });
    it('User should be able to log in as a caterer', (done) => {
      const userData = {
        email: 'softsky@live.com',
        password: 'testing123',
      };
      request(app)
        .post('/api/v1/users/auth/signin')
        .set('Accept', 'application/json')
        .send(userData)
        .end((err, res) => {
          adminToken = res.body.auth;
          expect(res.body.msg).to.equal('user logged in sucessfully');
          done();
        });
    });

    it('User should be able to log in as a customer', (done) => {
      const userData = {
        email: 'bola.kudi@live.com',
        password: 'moneyspeaking123',
      };
      request(app)
        .post('/api/v1/users/auth/signin')
        .set('Accept', 'application/json')
        .send(userData)
        .expect(200)
        .end((err, res) => {
          customerToken = res.body.auth;
          expect(res.body.msg).to.equal('user logged in sucessfully');
          done();
        });
    });

    it('should return invalid password if password provided is not authentic ', (done) => {
      const userData = {
        email: 'softsky@live.com',
        password: 'testing',
      };
      request(app)
        .post('/api/v1/users/auth/signin')
        .set('Accept', 'application/json')
        .send(userData)
        .end((err, res) => {
          expect(res.status).to.equal(401);
          expect(res.body.msg).to.equal('invalid password');
          done();
        });
    });
    it('should return user not found if email is incorrect', (done) => {
      const userData = {
        email: 'soft@live.com',
        password: 'testing123',
      };
      request(app)
        .post('/api/v1/users/auth/signin')
        .set('Accept', 'application/json')
        .send(userData)
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.body.msg).to.equal('user not found');
          done();
        });
    });
  });
  describe('Manage Meals Options API', () => {
    it('Caterer should be able to add a meal', (done) => {
      const meal = {
        name: 'Fried Rice with Chicken',
        quantity: 1,
        price: '1500',
        category: 'Intercontinental',
      };

      request(app)
        .post('/api/v1/auth/meals')
        .set('authorization', `${adminToken}`)
        .send(meal)
        .end((err, res) => {
          expect(res.status).to.equal(201);
          expect(res.body.msg).to.equal('meal added successfully');
          done();
        });
    });

    it('Customer should not be able to add a meal', (done) => {
      const meal = {
        name: 'Fried Rice with Chicken',
        quantity: 1,
        price: '1500',
        category: 'intercontinental',
      };

      request(app)
        .post('/api/v1/auth/meals')
        .set('authorization', `${customerToken}`)
        .send(meal)
        .end((err, res) => {
          expect(res.status).to.equal(403);
          expect(res.body.message).to.equal('access denied');
          done();
        });
    });


    it('Caterer should not be able to add a meal that already exists', (done) => {
      const meal = {
        name: 'Fried Rice with Chicken',
        quantity: 1,
        price: '1500',
        category: 'Interconinental',
      };

      request(app)
        .post('/api/v1/auth/meals')
        .set('authorization', `${adminToken}`)
        .send(meal)
        .end((err, res) => {
          expect(res.status).to.equal(409);
          expect(res.body.msg).to.equal('This meal is already existing');
          done();
        });
    });

    it('Caterer should be able to modify a meal', (done) => {
      const meal = {
        name: 'Fried Rice with Chicken',
        description: 'tasty rice and chicken which include carrot, green beans with salad',
        price: '5500',
        category: 'Intercontinental',
      };

      request(app)
        .put('/api/v1/auth/meals/1')
        .set('authorization', `${adminToken}`)
        .send(meal)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.msg).to.equal('meal modified successfully');
          done();
        });
    });
    it('Caterer should not be able to modify a meal that does not exist', (done) => {
      const meal = {
        name: 'Fried Rice with Chicken',
        description: 'tasty rice and chicken which include carrot, green beans with salad',
        price: '1500',
        category: 'Intercontinental',
      };

      request(app)
        .put('/api/v1/auth/meals/15')
        .set('authorization', `${adminToken}`)
        .send(meal)
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.body.msg).to.equal('meal does not exist');
          done();
        });
    });

    it('Customer should not be able not to modify a meal', (done) => {
      const meal = {
        name: 'Fried Rice with Chicken',
        description: 'tasty rice and chicken which include carrot, green beans with salad',
        price: '1500',
        category: 'Intercontinental',
      };

      request(app)
        .put('/api/v1/auth/meals/1')
        .set('authorization', `${customerToken}`)
        .send(meal)
        .end((err, res) => {
          expect(res.status).to.equal(403);
          expect(res.body.message).to.equal('access denied');
          done();
        });
    });
    it('caterer should be able to delete a meal', (done) => {
      request(app)
        .delete('/api/v1/auth/meals/1')
        .set('authorization', `${adminToken}`)
        .end((err, res) => {
          expect(res.status).to.equal(204);
          done();
        });
    });

    it('Customer should not be able delete a meal', (done) => {
      request(app)
        .delete('/api/v1/auth/meals/1')
        .set('authorization', `${customerToken}`)
        .end((err, res) => {
          expect(res.status).to.equal(403);
          done();
        });
    });

    it('Caterers should be able see a list of meals', (done) => {
      request(app)
        .get('/api/v1/auth/meals')
        .set('authorization', `${adminToken}`)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.success).to.equal(true);
          done();
        });
    });
  });
  describe(' Menu API', () => {
    it('Create bulk meals', (done) => {
      Meals.bulkCreate([
        {
          name: 'Jollof Rice with shredded beef',
          userId: 1,
          quantity: 40,
          price: 3000,
          date: '4/26/2018',
          category: 'Intercontinental',
        },

        {
          name: 'AMala with Goat Meat',
          userId: 1,
          quantity: 0,
          price: 3000,
          date: '4/26/2018',
          category: 'Africa',
        },

        {
          name: 'Pounded Yam with Egusi soup',
          userId: 1,
          quantity: 20,
          price: 5000,
          date: '4/27/2018',
          category: 'Africa',
        },

        {
          name: 'Beans and plaintain',
          userId: 1,
          quantity: 0,
          price: 3000,
          date: '4/26/2018',
          category: 'Africa',
        },
      ]).then(() => Meals.findAll()).then(meals => console.log(JSON.stringify(meals)))
        .catch(err => console.log(err.message));
      done();
    });
    it('Caterer should be able to setup menu by selecting meals from available options', (done) => {
      request(app)
        .post('/api/v1/auth/menus')
        .set('authorization', `${adminToken}`)
        .send({ meals: [3, 4, 5], title: 'Morning start' })
        .end((err, res) => {
          expect(res.status).to.equal(201);
          expect(res.body.success).to.equal(true);
          done();
        });
    });

    it('Caterer should not be able to set meal if meal quantity is equal to 0', (done) => {
      request(app)
        .post('/api/v1/auth/menus')
        .set('authorization', `${adminToken}`)
        .send({ meals: [4], title: 'Morning start' })
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.body.success).to.equal(false);
          done();
        });
    });

    it('Customers should be able to see menu for the day', (done) => {
      request(app)
        .get('/api/v1/auth/menu')
        .set('authorization', `${customerToken}`)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.success).to.equal(true);
          done();
        });
    });

    it('Customers Should not be able to see menu with invalid token', (done) => {
      request(app)
        .get('/api/v1/auth/menu')
        .set('authorization', `${customerToken}${'ghghjgjghg'}`)
        .end((err, res) => {
          expect(res.status).to.equal(403);
          expect(res.body.success).to.equal(false);
          done();
        });
    });
  });
  describe('Order-API', () => {
    it('should make an order from the menu', (done) => {
      request(app)
        .post('/api/v1/auth/orders')
        .set('authorization', `${customerToken}`)
        .send({ mealId: 3, quantity: 1 })
        .end((err, res) => {
          expect(res.status).to.equal(201);
          expect(res.body.success).to.equal(true);
          done();
        });
    });

    it('Customer should not make an order if specified quantity exceeds available quantity', (done) => {
      request(app)
        .post('/api/v1/auth/orders')
        .set('authorization', `${customerToken}`)
        .send({ mealId: 4, quantity: 20 })
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.body.msg).to.equal('Available quantity exceeded');
          done();
        });
    });
    it('should Modify an order', (done) => {
      request(app)
        .put('/api/v1/auth/orders/1')
        .set('authorization', `${customerToken}`)
        .send({
          mealId: 4,
        })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.success).to.equal(true);
          done();
        });
    });

    it('should not Modify an order', (done) => {
      request(app)
        .put('/api/v1/auth/orders/20')
        .set('authorization', `${customerToken}${'ghghjgjghg'}`)
        .send({
          mealId: 4,
        })
        .end((err, res) => {
          expect(res.status).to.equal(403);
          expect(res.body.success).to.equal(false);
          done();
        });
    });

    it('should return all orders for a specific day', (done) => {
      const date = new Date();
      const todaysDate = date.toISOString();

      request(app)
        .get(`/api/v1/auth/orders?date=${todaysDate}`)
        .set('authorization', `${customerToken}`)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.success).to.equal(true);
          done();
        });
    });
    it('A customer should not be able see orders for a specific day', (done) => {
      const date = new Date();
      const todaysDate = date.toISOString();

      request(app)
        .get(`/api/v1/auth/orders?date=${todaysDate}`)
        .set('authorization', `${customerToken}`)
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.body.success).to.equal(false);
          done();
        });
    });
  });
});
