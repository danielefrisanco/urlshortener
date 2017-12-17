
var chai = require('chai');
var chaiHttp = require('chai-http');
var app = require('../index');

var expect = chai.expect;

chai.use(chaiHttp);

describe('App', function() {
  describe('/shorten', function() {
    it('responds with status 200', function(done) {
      chai.request(app)
        .post('/shorten')
        .end(function(err, res) {
          expect(res).to.have.status(200);
          done();
        });
    });
  });
});