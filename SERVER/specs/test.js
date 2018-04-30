import mocha from 'mocha';
import chai from 'chai';
import request from 'supertest';
import app from '../server';

const { describe, it, after } = mocha;
const expect = chai.expect;

let isAuthentic;
let userId;
let isCustomerAuthentic;
let customerId;

describe('BOOK-A-MEAL API TEST SUITE', () => {
  after((done) => {
    // console.log(isAuthentic);
    console.log(userId);
    console.log(customerId);
    done();
  });
  describe('Users can create an account and log in', () => {
    it('should create an account for caterer', (done) => {
      const userData = {
        firstname: 'babatunde',
        lastname: 'ogedengbe',
        email: 'softsky@live.com',
        sex: 'M',
        password: 'testing123',
        cpassword: 'testing123',
        country: 'Nigeria',
        role: 'caterer',
      };
      request(app)
        .post('/api/v1/users')
        .set('Accept', 'application/json')
        .send(userData)
        .end((err, res) => {
          expect(res.status).to.equal(201);
          expect(res.body.msg).to.equal('users added successfully');
          done();
        });
    });

    it('should create an account for a user', (done) => {
      const userData = {
        firstname: 'Bolanle',
        lastname: 'Muritala',
        username: 'bolly',
        email: 'bola.kudi@live.com',
        sex: 'M',
        password: 'moneyspeaking123',
        cpassword: 'moneyspeaking123',
        country: 'Nigeria',
        role: 'user',
      };
      request(app)
        .post('/api/v1/users')
        .set('Accept', 'application/json')
        .send(userData)
        .end((err, res) => {
          expect(res.status).to.equal(201);
          expect(res.body.msg).to.equal('users added successfully');
          done();
        });
    });

    it('should be able to log in as caterer', (done) => {
      const userData = {
        username: 'softsky@live.com',
        password: 'testing123',
      };
      request(app)
        .post('/api/v1/users/auth')
        .set('Accept', 'application/json')
        .send(userData)
        .end((err, res) => {
          userId = res.body.user;
          isAuthentic = res.body.isAuth;
          // console.log(res.body);
          expect(res.body.msg).to.equal('user logged in sucessfully');
          done();
        });
    });

    it('should be able to log in as customer', (done) => {
      const userData = {
        username: 'bola.kudi@live.com',
        password: 'moneyspeaking123',
      };
      request(app)
        .post('/api/v1/users/auth')
        .set('Accept', 'application/json')
        .send(userData)
        .end((err, res) => {
          customerId = res.body.user;
          isCustomerAuthentic = res.body.isAuth;
          expect(res.body.msg).to.equal('user logged in sucessfully');
          done();
        });
    });

    it('should return invalid password', (done) => {
      const userData = {
        username: 'softsky@live.com',
        password: 'testing',
      };
      request(app)
        .post('/api/v1/users/auth')
        .set('Accept', 'application/json')
        .send(userData)
        .end((err, res) => {
          expect(res.status).to.equal(401);
          expect(res.body.msg).to.equal('invalid password');
          done();
        });
    });

    it('should return invalid password', (done) => {
      const userData = {
        username: 'soft@live.com',
        password: 'testing123',
      };
      request(app)
        .post('/api/v1/users/auth')
        .set('Accept', 'application/json')
        .send(userData)
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.body.msg).to.equal('user not found');
          done();
        });
    });

    it('should not create an existing account', (done) => {
      const userData = {
        firstname: 'Bolanle',
        lastname: 'Muritala',
        username: 'bolly',
        email: 'bola.kudi@live.com',
        sex: 'M',
        password: 'moneyspeaking123',
        cpassword: 'moneyspeaking123',
        country: 'Nigeria',
        role: 'user',
      };
      request(app)
        .post('/api/v1/users')
        .set('Accept', 'application/json')
        .send(userData)
        .end((err, res) => {
          expect(res.status).to.equal(409);
          expect(res.body.msg).to.equal('user already existing');
          done();
        });
    });

    it('should not create an account without firstname', (done) => {
      const userData = {
        firstname: '',
        lastname: 'Olusegun',
        username: 'segun',
        email: 'olusegun@live.com',
        sex: 'M',
        password: 'warlord123',
        cpassword: 'warlod123',
        country: 'Nigeria',
        role: 'user',
      };
      request(app)
        .post('/api/v1/users')
        .set('Accept', 'application/json')
        .send(userData)
        .end((err, res) => {
          expect(res.status).to.equal(422);
          done();
        });
    });
  });

  describe('Manage Meals Options', () => {
    it('should add a meal', (done) => {
      const meal = {
        name: 'Fried Rice with Chicken',
        description: 'tasty fried rice and chicken which include carrot, green beans with salad',
        price: '1500',
        category: 'Lunch',
      };

      request(app)
        .post('/api/v1/auth/meals')
        .set({ authorization: `${isAuthentic}`, user: `${userId}` })
        .send(meal)
        .end((err, res) => {
          expect(res.status).to.equal(201);
          expect(res.body.msg).to.equal('meal added successfully');
          done();
        });
    });

    it('should not add a meal', (done) => {
      const meal = {
        name: 'Fried Rice with Chicken',
        description: 'tasty fried rice and chicken which include carrot, green beans with salad',
        price: '1500',
        category: 'Lunch',
      };

      request(app)
        .post('/api/v1/auth/meals')
        .set({ authorization: `${isCustomerAuthentic}`, user: `${customerId}` })
        .send(meal)
        .end((err, res) => {
          expect(res.status).to.equal(403);
          expect(res.body.message).to.equal('access denied');
          done();
        });
    });

    describe('Already Existing Meal Names', () => {
      it('should not add a meal that already exist', (done) => {
        const meal = {
          name: 'Fried Rice with Chicken',
          description: 'tasty fried rice and chicken which include carrot, green beans with salad',
          price: '1500',
          category: 'Lunch',
        };

        request(app)
          .post('/api/v1/auth/meals')
          .set({ authorization: `${isAuthentic}`, user: `${userId}` })
          .send(meal)
          .end((err, res) => {
            expect(res.status).to.equal(409);
            expect(res.body.msg).to.equal('This meal already exist');
            done();
          });
      });
    });

    it('should modify a meal', (done) => {
      const meal = {
        name: 'Fried Rice with Chicken',
        description: 'tasty rice and chicken which include carrot, green beans with salad',
        price: '1500',
        category: 'Lunch',
      };

      request(app)
        .put('/api/v1/auth/meals/1')
        .set({ authorization: `${isAuthentic}`, user: `${userId}` })
        .send(meal)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.msg).to.equal('meal modified successfully');
          done();
        });
    });

    it('should not modify a meal that does not exist', (done) => {
      const meal = {
        name: 'Fried Rice with Chicken',
        description: 'tasty rice and chicken which include carrot, green beans with salad',
        price: '1500',
        category: 'Lunch',
      };

      request(app)
        .put('/api/v1/auth/meals/15')
        .set({ authorization: `${isAuthentic}`, user: `${userId}` })
        .send(meal)
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.body.msg).to.equal('meal does not exist');
          done();
        });
    });

    it('should not modify a meal', (done) => {
      const meal = {
        name: 'Fried Rice with Chicken',
        description: 'tasty rice and chicken which include carrot, green beans with salad',
        price: '1500',
        category: 'Lunch',
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
    it('should delete a meal', (done) => {
      const meal = {
        name: 'Fried Rice with Chicken',
        description: 'tasty rice and chicken which include carrot, green beans with salad',
        price: '1500',
        category: 'Lunch',
      };

      request(app)
        .delete('/api/v1/auth/meals/1')
        .set({ authorization: `${isAuthentic}`, user: `${userId}` })
        .send(meal)
        .end((err, res) => {
          expect(res.status).to.equal(204);
          done();
        });
    });

    it('should not delete a meal', (done) => {
      const meal = {
        name: 'Fried Rice with Chicken',
        description: 'tasty rice and chicken which include carrot, green beans with salad',
        price: '1500',
        category: 'Lunch',
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
  });

  describe(' setup menu for a specific day', () => {
    it('should not return menu for the day', (done) => {
      request(app)
        .get('/api/v1/auth/menu')
        .set({ authorization: `${isCustomerAuthentic}`, user: `${customerId}` })
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.body.msg).to.equal('menu not set for the day');
          done();
        });
    });
    it('should return list of meals', (done) => {
      request(app)
        .get('/api/v1/auth/meals')
        .set({ authorization: `${isAuthentic}`, user: `${userId}` })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.sucess).to.equal(true);
          done();
        });
    });
  });

  describe('Set menu for the day', () => {
    it('should setup menu by selecting meals from available options', (done) => {
      request(app)
        .post('/api/v1/auth/menus')
        .set({ authorization: `${isAuthentic}`, user: `${userId}` })
        .send({ meals: [3, 2] })
        .end((err, res) => {
          expect(res.status).to.equal(201);
          expect(res.body.success).to.equal(true);
          done();
        });
    });
  });

  describe('Setup Menu the same again', () => {
    it('should not setup menu by selecting meals from available options', (done) => {
      request(app)
        .post('/api/v1/auth/menus')
        .set({ authorization: `${isAuthentic}`, user: `${userId}` })
        .send({ meals: [1, 3, 2] })
        .end((err, res) => {
          expect(res.status).to.equal(409);
          expect(res.body.msg).to.equal('menu already set for the day');
          done();
        });
    });
  });

  describe('Get Menu', () => {
    it('should return menu for the day', (done) => {
      request(app)
        .get('/api/v1/auth/menu')
        .set({ authorization: `${isCustomerAuthentic}`, user: `${customerId}` })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.success).to.equal(true);
          done();
        });
    });
  });

  describe('Make an Order from the options presented in the menu', () => {
    it('should make an order from the menu', (done) => {
      request(app)
        .post('/api/v1/auth/orders')
        .set({ authorization: `${isCustomerAuthentic}`, user: `${customerId}` })
        .send({ mealId: 3 })
        .end((err, res) => {
          expect(res.status).to.equal(201);
          expect(res.body.success).to.equal(true);
          done();
        });
    });
  });
  describe('UnAuthenticated Users should not make an order', () => {
    it('should not make an order from the menu', (done) => {
      request(app)
        .post('/api/v1/auth/orders')
        .set({ authorization: `${isCustomerAuthentic = 'false'}`, user: `${customerId}` })
        .send({ mealId: 2 })
        .end((err, res) => {
          expect(res.status).to.equal(403);
          expect(res.body.msg).to.equal('user not authentic');
          done();
        });
    });
  });
  describe('Get all orders for a specific day', () => {
    it('should return all orders for a specific day', (done) => {
      request(app)
        .get('/api/v1/auth/orders?date=4/25/2018')
        .set({ authorization: `${isAuthentic}`, user: `${userId}` })
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
        .set({ authorization: `${isAuthentic}`, user: `${userId}` })
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.body.success).to.equal(false);
          done();
        });
    });
  });
  describe('Unknown paths', () => {
    it('should return path not found for unknown paths', (done) => {
      request(app)
        .get('/mnjghjghjgh')
        .end((err, res) => {
          expect(res.body.msg).to.equal('Page Not Found');
          done();
        });
    });
  });
});
