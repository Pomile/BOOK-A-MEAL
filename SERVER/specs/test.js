import mocha from 'mocha';
import chai from 'chai';
import 'babel-polyfill';
import request from 'supertest';
import app from '../server';
import { Users } from '../src/models';

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
  });
  describe('Users can create an account and log in', () => {
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
          console.log(res.body);
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
  describe('Caterers Manage Meals Options', () => {
    it('Caterer should be able to add a meal', (done) => {
      const meal = {
        name: 'Fried Rice with Chicken',
        description: 'tasty fried rice and chicken which include carrot, green beans with salad',
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
        description: 'tasty fried rice and chicken which include carrot, green beans with salad',
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
        description: 'tasty fried rice and chicken which include carrot, green beans with salad',
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

    /*  it('Caterer should be able to modify a meal', (done) => {
      const meal = {
        name: 'Fried Rice with Chicken',
        description: 'tasty rice and chicken which include carrot, green beans with salad',
        price: '1500',
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
        .set({ authorization: `${isAdminAuthentic}`, user: `${adminId}` })
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
        .set({ authorization: `${isCustomerAuthentic}`, user: `${customerId}` })
        .send(meal)
        .end((err, res) => {
          expect(res.status).to.equal(403);
          expect(res.body.message).to.equal('access denied');
          done();
        });
    });
    it('caterer should be able to delete a meal', (done) => {
      const meal = {
        name: 'Fried Rice with Chicken',
        description: 'tasty rice and chicken which include carrot, green beans with salad',
        price: '1500',
        category: 'Intercontinental',
      };

      request(app)
        .delete('/api/v1/auth/meals/1')
        .set({ authorization: `${isAdminAuthentic}`, user: `${adminId}` })
        .send(meal)
        .end((err, res) => {
          expect(res.status).to.equal(204);
          done();
        }); */
  });

  /* it('Customer should not be able delete a meal', (done) => {
      const meal = {
        name: 'Fried Rice with Chicken',
        description: 'tasty rice and chicken which include carrot, green beans with salad',
        price: '1500',
        category: 'Intercontinental',
      };

      request(app)
        .delete('/api/v1/auth/meals/1')
        .set({ authorization: `${isCustomerAuthentic}`, user: `${customerId}` })
        .send(meal)
        .end((err, res) => {
          expect(res.status).to.equal(403);
          done();
        });
    });

    it('Caterers should be able see a list of meals', (done) => {
      request(app)
        .get('/api/v1/auth/meals')
        .set({ authorization: `${isAdminAuthentic}`, user: `${adminId}` })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.sucess).to.equal(true);
          done();
        });
    });
  });
  describe(' Caterers can Setup menu for a specific day', () => {
    it('Caterer should be able to setup menu by selecting meals from available options', (done) => {
      request(app)
        .post('/api/v1/auth/menus')
        .set({ authorization: `${isAdminAuthentic}`, user: `${adminId}` })
        .send({ meals: [3, 2] })
        .end((err, res) => {
          expect(res.status).to.equal(201);
          expect(res.body.success).to.equal(true);
          done();
        });
    });

    it('Caterer should not be able to set menu if no meal is selected', (done) => {
      request(app)
        .post('/api/v1/auth/menus')
        .set({ authorization: `${isAdminAuthentic}`, user: `${adminId}` })
        .send({ meals: [0] })
        .end((err, res) => {
          expect(res.status).to.equal(409);
          expect(res.body.success).to.equal(false);
          done();
        });
    });
  });
  describe('Customers should Get Menu and make order', () => {
    it('Customers should be able to see menu for the day', (done) => {
      request(app)
        .get('/api/v1/auth/menu')
        .set({ authorization: `${isCustomerAuthentic}`, user: `${customerId}` })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.success).to.equal(true);
          done();
        });
    });

    it('should not return menu for the day if a customer is not authenticated', (done) => {
      request(app)
        .get('/api/v1/auth/menu')
        .set({ authorization: `${isCustomerAuthentic = 'false'}`, user: `${customerId}` })
        .end((err, res) => {
          expect(res.status).to.equal(403);
          expect(res.body.success).to.equal(false);
          done();
        });
    });

    it('should make an order from the menu', (done) => {
      request(app)
        .post('/api/v1/auth/orders')
        .set({ authorization: `${isCustomerAuthentic = 'true'}`, user: `${customerId}` })
        .send({ mealId: 3 })
        .end((err, res) => {
          expect(res.status).to.equal(201);
          expect(res.body.success).to.equal(true);
          done();
        });
    });

    it('should not make an order if selected meal is not available', (done) => {
      request(app)
        .post('/api/v1/auth/orders')
        .set({ authorization: `${isCustomerAuthentic}`, user: `${customerId}` })
        .send({ mealId: 2 })
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.body.msg).to.equal('This Meal is not available');
          done();
        });
    });
  });
  describe('Authenticated users (customers) should be able to change their meal choice', () => {
    it('should Modify an order', (done) => {
      request(app)
        .put('/api/v1/auth/orders/4')
        .set({ authorization: `${isCustomerAuthentic = 'true'}`, user: `${customerId}` })
        .send({
          username: 'bola.kudi@live.com',
          price: 7000,
          meal: 'Cat fish with vegetable',
          date: '4/27/2018',
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
        .set({ authorization: `${isCustomerAuthentic = 'true'}`, user: `${customerId}` })
        .send({
          username: 'bola.kudi@live.com',
          price: 7000,
          meal: 'Cat fish with vegetable',
          date: '4/27/2018',
        })
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.body.success).to.equal(false);
          done();
        });
    });
  });
  describe('Cutomers get all orders for a specific day', () => {
    it('should return all orders for a specific day', (done) => {
      request(app)
        .get('/api/v1/auth/orders?date=4/25/2018')
        .set({ authorization: `${isAdminAuthentic}`, user: `${adminId}` })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.success).to.equal(true);
          done();
        });
    });
  });

  describe('No Orders for Specified Date', () => {
    it('should return false for a specific day', (done) => {
      request(app)
        .get('/api/v1/auth/orders?date=4/25/2017')
        .set({ authorization: `${isAdminAuthentic}`, user: `${adminId}` })
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.body.success).to.equal(false);
          done();
        });
    });
  }); */
});
