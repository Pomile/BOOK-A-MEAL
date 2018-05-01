import mocha from 'mocha';
import chai from 'chai';
import request from 'supertest';
import app from '../server';

const { describe, it } = mocha;
const expect = chai.expect;

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
  });
});
