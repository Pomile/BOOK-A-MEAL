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
    it('should access the home page', (done) => {
      request(app)
        .get('/api/v1/user')
        .set('accept', 'application/json')
        .expect(200, done);
    });

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
  });

  describe(' setup menu for a specific day', () => {
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

  describe('Get menu for the day', () => {
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
  });
});
