
var chai = require('chai');
var chaiHttp = require('chai-http');
var app = require('../index');
// app.settings.env = 'test';
console.log("fix env test/ ddev, clear db, put preare values in db")
var expect = chai.expect;
chai.use(chaiHttp);

describe('App', function() {
	// before(function(done) {
	// 	console.log("TODO clean database")
	// });
  describe('/shorten', function() {
    it('responds with status 201 when a desired shortcode is not present ', function(done) {
      chai.request(app)
        .post('/shorten')
        .send({ url: 'http://example.com/', shortcode: "example" })
        .end(function(err, res) {
          console.log("must cleaan db")
          done();

        	expect(res).to.be.json;
          expect(res).to.have.status(201);
          expect(res).to.have.own.property("body");
          expect(res.body).to.be.a("string");
          expect(res.body).to.match(/example/);
          done();
        });
    });
		it('responds with status 201 with a desired shortcode that is case different', function(done) {
      chai.request(app)
	      .post('/shorten')
	      .send({ url: 'http://example.com/', shortcode: "case_sensitive" })
	      .then(function(res) {
	      	expect(res).to.have.status(201);
	      	expect(res.body).to.equal('case_sensitive');
	        chai.request(app)
	          .post('/shorten')
	      		.send({ url: 'http://example.com/', shortcode: "Case_sensitive" })
	          .end(function(err, res) {
          console.error("must clean db")

	            done();

	            expect(res).to.have.status(201);
	            expect(res.body).to.equal('Case_sensitive');
	            done();

	          });
	      }).catch(function(err) {
          console.error("error")
          done();
	      });
      	
    });
     
		it('responds with status 201 and a shorten url', function(done) {
      chai.request(app)
        .post('/shorten')
        .send({ url: 'http://example.com/' })
        .end(function(err, res) {
        	expect(res).to.be.json;
          expect(res).to.have.status(201);
          expect(res).to.have.own.property("body");
          expect(res.body).to.be.a("string");
          expect(res.body).to.match(/^[0-9a-zA-Z_]{6}$/);
          done();
        });
    });


    it('responds with status 400 when url is not present', function(done) {
      chai.request(app)
        .post('/shorten')
        .send({ url: ' ' })
        .end(function(err, res) {
        	expect(res).to.be.json;
          expect(res).to.have.status(400);
          done();
        });
    });
    it('responds with status 400 when url is not present nor json', function(done) {
      chai.request(app)
        .post('/shorten')
        .send()
        .end(function(err, res) {
        	expect(res).to.be.json;
          expect(res).to.have.status(400);
          done();
        });
    });
    
    it('responds with status 409 when the desired shortcode is already in use.', function(done) {
      chai.request(app)
	      .post('/shorten')
	      .send({ url: 'http://example.com/', shortcode: "used" })
	      .then(function() {
	        chai.request(app)
	          .post('/shorten')
	      		.send({ url: 'http://example.com/', shortcode: "used" })
	          .end(function(err, res) {
          console.error("must clean db")

	            done();

	            expect(res).to.have.status(409);
	            done();
	          });
	      }).catch(function(err) {
          console.error("error")
          done();

	      });
    });

    it('responds with status 422 when The shortcode fails to meet the following regexp: ^[0-9a-zA-Z_]{4,}$', function(done) {
      chai.request(app)
        .post('/shorten')
        .send({ url: 'http://example.com/', shortcode: "00" })
        .end(function(err, res) {
        	expect(res).to.be.json;
          expect(res).to.have.status(422);
        })
      chai.request(app)
        .post('/shorten')
        .send({ url: 'http://example.com/', shortcode: "@" })
        .end(function(err, res) {
        	expect(res).to.be.json;
          expect(res).to.have.status(422);
          done();
        });

    });


  });


  describe('/:shortcode', function() {
    it('responds with status 302 when shortcode is found', function(done) {
      chai.request(app)
        .get('/example')
        .end(function(err, res) {


        	console.log(res)
          // expect(res.statusCode).to.equal(302);
          // expect(res).to.have.status(302);
          // TODO chai is problematic with redirects
          expect(res.redirects[0]).to.equal("http://example.com/");

          console.log("check redirecCount is increased");
          done();
        });
    });
    it('responds with status 404 when the shortcode cannot be found', function(done) {
      chai.request(app)
        .get('/e')
        .end(function(err, res) {

        	expect(res).to.be.json;
          expect(res).to.have.status(404);
          done();
        });
    });
  });


  describe('/:shortcode/stats', function() {
    
		it('responds with status 200 when shortcode is found with the stats', function(done) {
      chai.request(app)
        .get('/example/stats')
        .end(function(err, res) {
        	expect(res).to.be.json;
          expect(res).to.have.status(200);
          expect(res).to.have.own.property("body");
          expect(res.body).to.have.nested.property("startDate");
          expect(res.body).to.have.nested.property("lastSeenDate");
          expect(res.body).to.have.nested.property("redirectCount");
          expect(Date.parse(res.body.startDate)).to.not.be.equal(NaN);
          expect(Date.parse(res.body.lastSeenDate)).to.not.be.equal(NaN);
          expect(parseInt(res.body.redirectCount)).to.not.be.equal(NaN);
          //TODO check the values are right
          console.log("TODO are vualeus correct?")
          done();
        });
    });
    it('responds with status 404 when the shortcode cannot be found', function(done) {
      chai.request(app)
        .get('/e')
        .end(function(err, res) {

        	expect(res).to.be.json;
          expect(res).to.have.status(404);
          done();
        });
    });
  });
});