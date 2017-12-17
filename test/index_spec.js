
var chai = require('chai');
var chaiHttp = require('chai-http');
var app = require('../index');
// app.settings.env = 'test';
console.log("fix env test/ ddev")
var expect = chai.expect;

chai.use(chaiHttp);

describe('App', function() {

  describe('/shorten', function() {
    it('whith a preferred shorten code, responds with status 201', function(done) {
      chai.request(app)
        .post('/shorten')
        .send({ url: 'http://example.com', shortcode: "example" })
        .end(function(err, res) {
          done();

          expect(res).to.have.status(201);
          expect(res).to.have.own.property("body")
          expect(res.body).to.be.a("string");
          expect(res.body).to.match(/example/);
          done();
        });
    });
		it('responds with status 201 and a shorten url', function(done) {
      chai.request(app)
        .post('/shorten')
        .send({ url: 'http://example.com' })
        .end(function(err, res) {
          expect(res).to.have.status(201);
          expect(res).to.have.own.property("body")
          expect(res.body).to.be.a("string");
          expect(res.body).to.match(/^[0-9a-zA-Z_]{6}$/);
          done();
        });
    });


    it('responds with status 400 when url is empty', function(done) {
      chai.request(app)
        .post('/shorten')
        .send({ url: ' ' })
        .end(function(err, res) {
          expect(res).to.have.status(400);
          done();
        });
    });
    it('responds with status 400 when no json is passed', function(done) {
      chai.request(app)
        .post('/shorten')
        .send()
        .end(function(err, res) {
          expect(res).to.have.status(400);
          done();
        });
    });

  });
});