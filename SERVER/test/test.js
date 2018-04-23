import mocha from 'mocha';
import chai from 'chai';
import request from 'supertest';
import app from '../server';

const { describe, it } = mocha;
const expect = chai.expect;

let isAuth;

describe('BOOK-A-MEAL API TEST SUITE', () => {
  describe('Users can create an account and log in', () => {
    it('should access the home page', (done) => {
      request(app)
        .get('/api/v1/user')
        .set('accept', 'application/json')
        .expect(200, done);
    });
  });
});
