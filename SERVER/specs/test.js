import mocha from 'mocha';
import chai from 'chai';
import 'babel-polyfill';
import request from 'supertest';
import app from '../server';
import db from '../src/models';
import auth2Code from './googleAuthCode.json';

const { describe, it, before } = mocha;
const expect = chai.expect;
const meal = {
  name: 'Fried Rice with Chicken', quantity: 10, price: 1505, category: 'Intercontinental',
};
const cusMeal = {
  name: 'Garri and Egusi', quantity: 2, price: '1700', category: 'intercontinental',
};
const meal1Modified1 = {
  name: 'Fried Rice with Chicken', quantity: 43, price: 5500, category: 'Intercontinental',
};

let adminToken;
let superAdminToken;
let customerToken;
let verifiedEmailToken;
const auth = auth2Code;
const expiredAuth = '4/AAC3IqyNQgVsY8soU_Uwubo0v8MlFu3NMRzg9pkPS_Ze8fl7Q6muSp519ZAtbkh1BLmoJEmWz7Oa6K6RlzEVc6I';
const date = new Date();
const todaysDate = date.toISOString();

describe('BOOK-A-MEAL API TEST SUITE', () => {
  before(() => db.sequelize.sync({ force: true }));
  describe('Users API', () => {
    it('A caterer should be able to create an account', (done) => {
      const newUserData = {
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
        .send(newUserData)
        .end((err, res) => {
          expect(res.status).to.equal(201);
          expect(res.body.msg).to.equal('User added successfully');
          done();
        });
    });

    it('A user(caterer) should be able to log in', (done) => {
      const userData1 = {
        email: 'softsky@live.com',
        password: 'testing123',
      };
      request(app)
        .post('/api/v1/users/auth/signin')
        .set('Accept', 'application/json')
        .send(userData1)
        .end((err, res) => {
          adminToken = res.body.auth;
          expect(res.body.msg).to.equal('user logged in sucessfully');
          done();
        });
    });

    it('A user(customer) should be able to create an account', (done) => {
      const newUserData2 = {
        firstname: 'Bolanle',
        lastname: 'Muritala',
        email: 'bola.kudi@live.com',
        password: 'moneyspeaking123',
        cpassword: 'moneyspeaking123',
      };
      request(app)
        .post('/api/v1/users/auth/signup')
        .set('Accept', 'application/json')
        .send(newUserData2)
        .end((err, res) => {
          expect(res.status).to.equal(201);
          expect(res.body.msg).to.equal('User added successfully');
          done();
        });
    });

    it('A user (customer) should be able to log in', (done) => {
      const userData2 = {
        email: 'bola.kudi@live.com',
        password: 'moneyspeaking123',
      };
      request(app)
        .post('/api/v1/users/auth/signin')
        .set('Accept', 'application/json')
        .send(userData2)
        .expect(200)
        .end((err, res) => {
          customerToken = res.body.auth;
          expect(res.body.msg).to.equal('user logged in sucessfully');
          done();
        });
    });

    it('A user(super-user) should be able to create an account', (done) => {
      const newUserData3 = {
        firstname: 'admin',
        lastname: 'admin',
        email: 'admin@live.com',
        password: 'admin123',
        cpassword: 'admin123',
        role: 'admin',
      };
      request(app)
        .post('/api/v1/users/auth/signup')
        .set('Accept', 'application/json')
        .send(newUserData3)
        .end((err, res) => {
          expect(res.status).to.equal(201);
          expect(res.body.msg).to.equal('User added successfully');
          done();
        });
    });

    it('A user(super-user) should be able to log in', (done) => {
      const userData3 = {
        email: 'admin@live.com',
        password: 'admin123',
      };
      request(app)
        .post('/api/v1/users/auth/signin')
        .set('Accept', 'application/json')
        .send(userData3)
        .end((err, res) => {
          superAdminToken = res.body.auth;
          expect(res.body.msg).to.equal('user logged in sucessfully');
          done();
        });
    });
    it('A user should not be able to create an existing email address', (done) => {
      const newUserData4 = {
        firstname: 'Bolanle',
        lastname: 'Muritala',
        email: 'bola.kudi@live.com',
        password: 'moneyspeaking123',
        cpassword: 'moneyspeaking123',
      };
      request(app)
        .post('/api/v1/users/auth/signup')
        .set('Accept', 'application/json')
        .send(newUserData4)
        .end((err, res) => {
          expect(res.status).to.equal(409);
          expect(res.body.msg).to.equal('user already exists');
          done();
        });
    });
    it('A user should not be able create an account without firstname', (done) => {
      const newUserData5 = {
        firstname: '',
        lastname: 'Olusegun',
        username: 'segun',
        email: 'olusegun@live.com',
        password: 'warlord123',
        cpassword: 'warlod123',
      };
      request(app)
        .post('/api/v1/users/auth/signup')
        .set('Accept', 'application/json')
        .send(newUserData5)
        .end((err, res) => {
          expect(newUserData5).to.have.property('firstname');
          expect(newUserData5).to.have.property('lastname');
          expect(newUserData5).to.have.property('username');
          expect(newUserData5).to.have.property('email');
          expect(newUserData5).to.have.property('password');
          expect(newUserData5).to.have.property('cpassword');
          // console.log(res.body);
          expect(res.body.errors[0].msg).to.equal('firstname is required');
          expect(res.status).to.equal(422);
          done();
        });
    });

    it('A user should be able to see his/her profile', (done) => {
      request(app)
        .get('/api/v1/auth/user/profile')
        .set('authorization', `${customerToken}`)
        .expect(200)
        .end((err, res) => {
          expect(res.body.success).to.equal(true);
          done();
        });
    });

    it('A user should not be able to login if the password provided is invalid', (done) => {
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
    it('A user should not be able to login if email is incorrect', (done) => {
      const userData6 = {
        email: 'soft@live.com',
        password: 'testing123',
      };
      request(app)
        .post('/api/v1/users/auth/signin')
        .set('Accept', 'application/json')
        .send(userData6)
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.body.msg).to.equal('user not found');
          done();
        });
    });

    it('A user should be able to update his/her profile', (done) => {
      const user1 = {
        firstname: 'Babatunde',
        lastname: 'Ogedengbe',
        email: 'Softsky@live.com',
      };
      request(app)
        .put('/api/v1/auth/user/profile')
        .set('authorization', `${adminToken}`)
        .field('firstname', user1.firstname)
        .field('lastname', user1.lastname)
        .field('email', user1.email)
        .attach('image', `${__dirname}/images/oba.jpg`)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.success).to.equal(true);
          done();
        });
    });

    it('A user should be able to verify email for password reset', (done) => {
      request(app)
        .get('/api/v1/users/auth/email-confirmation')
        .set('Accept', 'application/json')
        .send({ email: 'bola.kudi@live.com' })
        .end((err, res) => {
          verifiedEmailToken = res.body.token;
          expect(res.status).to.equal(200);
          expect(res.body.isValid).to.equal(true);
          done();
        });
    });

    it('A user should be able to reset password', (done) => {
      request(app)
        .put('/api/v1/auth/user/reset-password')
        .set('authorization', `${verifiedEmailToken}`)
        .send({
          password: 'mekudispeaking123',
          cpassword: 'mekudispeaking123',
        })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.isPasswordUpdated).to.equal(true);
          done();
        });
    });

    it('A user should not be able to verify email for reset password', (done) => {
      request(app)
        .get('/api/v1/users/auth/email-confirmation')
        .set('Accept', 'application/json')
        .send({ email: 'bol.kudi@live.com' })
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.body.isValid).to.equal(false);
          done();
        });
    });

    it('A user(super-user) should be able to modify a user role', (done) => {
      const user = { email: 'Softsky@live.com', role: 'caterer' };
      request(app)
        .put('/api/v1/auth/user/grant-role')
        .set('authorization', `${superAdminToken}`)
        .send(user)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.msg).to.equal('Priviledge granted');
          expect(res.body.success).to.equal(true);
          done();
        });
    });
  });
  describe('Manage Meals Options API', () => {
    it('A caterer should be able to add a meal', (done) => {
      const imagePath = `${__dirname}/images/Chickery-Fish.jpg`;
      request(app)
        .post('/api/v1/auth/meals')
        .set('authorization', `${adminToken}`)
        .field('name', meal.name)
        .field('quantity', meal.quantity)
        .field('price', meal.price)
        .field('category', meal.category)
        .attach('image', imagePath)
        .end((err, res) => {
          expect(res.status).to.equal(201);
          expect(res.body.msg).to.equal('meal added successfully');
          done();
        });
    });

    it('A caterer should be able to modify a meal', (done) => {
      const imagePath = `${__dirname}/images/Chickery-Fish.jpg`;
      request(app)
        .put('/api/v1/auth/meals/1')
        .set('authorization', `${adminToken}`)
        .field('name', meal1Modified1.name)
        .field('quantity', meal1Modified1.quantity)
        .field('price', meal1Modified1.price)
        .field('category', meal1Modified1.category)
        .attach('image', imagePath)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.msg).to.equal('meal modified successfully');
          done();
        });
    });

    it('A caterer should not be able to add a meal that already exists', (done) => {
      const imagePath = `${__dirname}/images/Chickery-Fish.jpg`;
      request(app)
        .post('/api/v1/auth/meals')
        .set('authorization', `${adminToken}`)
        .field('name', meal.name)
        .field('quantity', meal.quantity)
        .field('price', meal.price)
        .field('category', meal.category)
        .attach('image', imagePath)
        .end((err, res) => {
          expect(res.body.msg).to.equal('This meal already exists');
          done();
        });
    });

    it('A caterer should be able to delete a meal', (done) => {
      request(app)
        .delete('/api/v1/auth/meals/1')
        .set('authorization', `${adminToken}`)
        .end((err, res) => {
          expect(res.status).to.equal(204);
          done();
        });
    });

    it('Create bulk meal', (done) => {
      const meals = {
        data: [
          {
            name: 'Oha soup', userId: 1, quantity: 40, price: 3000, date: '4/26/2018', category: 'Africa',
          },
          {
            name: 'AMala with Goat Meat', userId: 1, quantity: 2, price: 3000, date: '4/26/2018', category: 'Africa',
          },
          {
            name: 'Chiken and chips', userId: 1, quantity: 20, price: 5000, date: '4/27/2018', category: 'Intercontinental',
          },
          {
            name: 'Pastal with shredded beef', userId: 1, quantity: 0, price: 3000, date: '4/26/2018', category: 'Intercontinental',
          },
        ],
      };
      request(app)
        .post('/api/v1/auth/bulkmeals')
        .set('authorization', `${adminToken}`)
        .query({ bulkMeals: meals.data })
        .attach('images', `${__dirname}/images/oha_soup.jpg`)
        .attach('images', `${__dirname}/images/amala-yahoo.jpg`)
        .attach('images', `${__dirname}/images/Chickery-Fish.jpg`)
        .attach('images', `${__dirname}/images/pastal.jpg`)
        .end((err, res) => {
          expect(res.status).to.equal(201);
          expect(res.body.success).to.equal(true);
          done();
        });
    });

    it('A customer should not be able to add a meal', (done) => {
      const imagePath = `${__dirname}/images/Chickery-Fish.jpg`;
      request(app)
        .post('/api/v1/auth/meals')
        .set('authorization', `${customerToken}`)
        .field('name', cusMeal.name)
        .field('quantity', cusMeal.quantity)
        .field('price', cusMeal.price)
        .field('category', cusMeal.category)
        .attach('image', imagePath)
        .end((err, res) => {
          expect(res.status).to.equal(403);
          expect(res.body.message).to.equal('access denied');
          done();
        });
    });

    it('A caterer should not be able to add a meal without image', (done) => {
      const meal1WithoutImage = {
        name: 'Fried Rice with meat',
        quantity: 3,
        price: '1569',
        category: 'Intercontinental',
      };
      request(app)
        .post('/api/v1/auth/meals')
        .set('authorization', `${adminToken}`)
        .field('name', meal1WithoutImage.name)
        .field('quantity', meal1WithoutImage.quantity)
        .field('price', meal1WithoutImage.price)
        .field('category', meal1WithoutImage.category)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.msg).to.equal('Meal image is required');
          done();
        });
    });

    it('A caterer should not be able to modify a meal that does not exist', (done) => {
      const imagePath = `${__dirname}/images/Chickery-Fish.jpg`;
      request(app)
        .put('/api/v1/auth/meals/15')
        .set('authorization', `${adminToken}`)
        .field('name', meal.name)
        .field('quantity', meal.quantity)
        .field('price', meal.price)
        .field('category', meal.category)
        .attach('image', imagePath)
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.body.msg).to.equal('meal does not exist');
          done();
        });
    });

    it('A Customer should not be able to delete a meal that does not exist', (done) => {
      request(app)
        .delete('/api/v1/auth/meals/200')
        .set('authorization', `${adminToken}`)
        .end((err, res) => {
          expect(res.status).to.equal(404);
          done();
        });
    });

    it('A Customer should not be able not to modify a meal', (done) => {
      const imagePath = `${__dirname}/images/Chickery-Fish.jpg`;
      request(app)
        .put('/api/v1/auth/meals/1')
        .set('authorization', `${customerToken}`)
        .field('name', meal.name)
        .field('quantity', meal.quantity)
        .field('price', meal.price)
        .field('category', meal.category)
        .attach('image', imagePath)
        .end((err, res) => {
          expect(res.status).to.equal(403);
          expect(res.body.message).to.equal('access denied');
          done();
        });
    });

    it('A Customer should not be able to delete a meal', (done) => {
      request(app)
        .delete('/api/v1/auth/meals/1')
        .set('authorization', `${customerToken}`)
        .end((err, res) => {
          expect(res.status).to.equal(403);
          done();
        });
    });

    it('A user should not be able to access any feature without a token', (done) => {
      request(app)
        .delete('/api/v1/auth/meals/1')
        .end((err, res) => {
          expect(res.status).to.equal(403);
          done();
        });
    });
    it('A Caterer should be able see a list of meals', (done) => {
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
    it('A Caterer should be able to setup menu', (done) => {
      request(app)
        .post('/api/v1/auth/menus')
        .set('authorization', `${adminToken}`)
        .send({ meals: [2, 3, 4, 5], title: 'Morning start' })
        .end((err, res) => {
          expect(res.status).to.equal(201);
          expect(res.body.success).to.equal(true);
          done();
        });
    });

    it('A caterer should be able to send an email when menu is set', (done) => {
      request(app)
        .get(`/api/v1/auth/oauth2callback?code=${auth.code}`)
        .set('Accept', 'application/json')
        .end((err, res) => {
          expect(res.status).to.equal(201);
          expect(res.body.msg).to.equal('menu is set sucessfully and customers are notified');
          done();
        });
    });

    it('A caterer should be able to send an email without auth code', (done) => {
      request(app)
        .get('/api/v1/auth/oauth2callback?')
        .set('Accept', 'application/json')
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.msg).to.equal('Bad request');
          done();
        });
    });

    it('A caterer should not be able to send an email with expired authorization code', (done) => {
      request(app)
        .get(`/api/v1/auth/oauth2callback?code=${expiredAuth}`)
        .set('Accept', 'application/json')
        .end((err, res) => {
          expect(res.status).to.equal(401);
          expect(res.body.msg).to.equal('invalid grant');
          done();
        });
    });

    it('A Caterer should not be able to setup another menu on the same day', (done) => {
      request(app)
        .post('/api/v1/auth/menus')
        .set('authorization', `${adminToken}`)
        .send({ meals: [2, 3, 4, 5], title: 'Morning start' })
        .end((err, res) => {
          expect(res.status).to.equal(409);
          expect(res.body.success).to.equal(false);
          done();
        });
    });

    it('A Caterer should not be able to add meal to a menu if meal quantity is equal to 0', (done) => {
      request(app)
        .post('/api/v1/auth/menus')
        .set('authorization', `${adminToken}`)
        .send({ meals: [6], title: 'Lunch' })
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.body.success).to.equal(false);
          done();
        });
    });

    it('A Customer should be able to see menu for the day', (done) => {
      request(app)
        .get('/api/v1/auth/menu')
        .set('authorization', `${customerToken}`)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.success).to.equal(true);
          done();
        });
    });

    it('A Customer Should not be able to see menu with invalid token', (done) => {
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
    it('A customer should be able to make an order from the menu', (done) => {
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

    it('A customer should not be able to  make an order if ordered quantity exceeds available quantity', (done) => {
      request(app)
        .post('/api/v1/auth/orders')
        .set('authorization', `${customerToken}`)
        .send({ mealId: 3, quantity: 70 })
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.body.msg).to.equal('Available quantity exceeded');
          done();
        });
    });
    it('A customer should be able to Modify an order', (done) => {
      request(app)
        .put('/api/v1/auth/orders/1')
        .set('authorization', `${customerToken}`)
        .send({
          mealId: 5,
        })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.success).to.equal(true);
          done();
        });
    });

    it('A customer should not be able to Modify an order', (done) => {
      request(app)
        .put('/api/v1/auth/orders/20')
        .set('authorization', `${customerToken}${'ghghjgjghg'}`)
        .send({
          mealId: 5,
        })
        .end((err, res) => {
          expect(res.status).to.equal(403);
          expect(res.body.success).to.equal(false);
          done();
        });
    });

    it('A customer should be able to see his/her orders for the day', (done) => {
      request(app)
        .get('/api/v1/auth/orders')
        .set('authorization', `${customerToken}`)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.success).to.equal(true);
          done();
        });
    });
    it('A Customer should not be able to see all orders for a specific day', (done) => {
      request(app)
        .get(`/api/v1/auth/orders?date=${todaysDate}`)
        .set('authorization', `${customerToken}`)
        .end((err, res) => {
          expect(res.status).to.equal(403);
          expect(res.body.success).to.equal(false);
          expect(res.body.message).to.equal('access denied');
          done();
        });
    });
    it('A Caterer should be able to see all orders for a specific day, including total money made', (done) => {
      request(app)
        .get(`/api/v1/auth/orders?date=${todaysDate}`)
        .set('authorization', `${adminToken}`)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.success).to.equal(true);
          done();
        });
    });
  });
});
