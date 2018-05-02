import mocha from 'mocha';
import chai from 'chai';
import request from 'supertest';
import app from '../server';

const { describe, it } = mocha;
const expect = chai.expect;
let isAdminAuthentic;
let adminId;
let isCustomerAuthentic;
let customerId;

describe('BOOK-A-MEAL API TEST SUITE', () => {
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
        .post('/api/v1/users')
        .set('Accept', 'application/json')
        .send(userData)
        .end((err, res) => {
          expect(res.status).to.equal(201);
          expect(res.body.msg).to.equal('users added successfully');
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
        .post('/api/v1/users')
        .set('Accept', 'application/json')
        .send(userData)
        .end((err, res) => {
          expect(res.status).to.equal(201);
          expect(res.body.msg).to.equal('users added successfully');
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
        password: 'warlord123',
        cpassword: 'warlod123',
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
    it('User should be able to log in as a caterer', (done) => {
      const userData = {
        username: 'softsky@live.com',
        password: 'testing123',
      };
      request(app)
        .post('/api/v1/users/auth')
        .set('Accept', 'application/json')
        .send(userData)
        .end((err, res) => {
          adminId = res.body.user;
          isAdminAuthentic = res.body.isAuth;
          expect(res.body.msg).to.equal('user logged in sucessfully');
          done();
        });
    });

    it('User should be able to log in as a customer', (done) => {
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

    it('should return invalid password if password provided is not authentic ', (done) => {
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


    it('should return user not found if email is incorrect', (done) => {
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
  });
  describe('Manage Meals Options', () => {
    it('Caterer should be able to add a meal', (done) => {
      const meal = {
        name: 'Fried Rice with Chicken',
        description: 'tasty fried rice and chicken which include carrot, green beans with salad',
        price: '1500',
        category: 'Lunch',
      };

      request(app)
        .post('/api/v1/auth/meals')
        .set({ authorization: `${isAdminAuthentic}`, user: `${adminId}` })
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


    it('Caterer should not be able to add a meal that already exists', (done) => {
      const meal = {
        name: 'Fried Rice with Chicken',
        description: 'tasty fried rice and chicken which include carrot, green beans with salad',
        price: '1500',
        category: 'Lunch',
      };

      request(app)
        .post('/api/v1/auth/meals')
        .set({ authorization: `${isAdminAuthentic}`, user: `${adminId}` })
        .send(meal)
        .end((err, res) => {
          expect(res.status).to.equal(409);
          expect(res.body.msg).to.equal('This meal is already existing');
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
        .set({ authorization: `${isAdminAuthentic}`, user: `${adminId}` })
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
        .set({ authorization: `${isAdminAuthentic}`, user: `${adminId}` })
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
  });
});
