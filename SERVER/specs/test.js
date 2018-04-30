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
});
