import mocha from 'mocha';
import chai from 'chai';
import request from 'supertest';
import app from '../server';

const { describe, it, after } = mocha;
const expect = chai.expect;

let isAuthentic;

describe('BOOK-A-MEAL API TEST SUITE', () => {
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

    it('User should be able to log in', (done) => {
      const userData = {
        username: 'softsky@live.com',
        password: 'testing123',
      };
      request(app)
        .post('/api/v1/users/auth')
        .set('Accept', 'application/json')
        .send(userData)
        .end((err, res) => {
          isAuthentic = res.body.isAuth;
          expect(res.body.msg).to.equal('user logged in sucessfully');
          done();
        });
    });
  });
});
