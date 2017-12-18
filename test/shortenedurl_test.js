var ShortenedUrl = require("../models/ShortenedUrl.js");
const expect = require('chai').expect
var mongoose = require('mongoose');

describe('ShortenedUrl module', () => {

  beforeEach(function (done) {

    function clearDB() {
      ShortenedUrl.remove().exec().then(function () {
        done();
      });
    };

    if(mongoose.connection.readyState === 0) {
      mongoose.connect(config.dbUrl, function(err) {
        if(err) {
          throw err;
        }
        return clearDB();
      });
    } else {
      return clearDB();
    }
  });


  describe('"initialize"', () => {
    it('should export a function', () => {
      expect(ShortenedUrl.initialize).to.be.a('function')
    })
    it('should return a ShortenedUrl with valid values', function(done) {
      ShortenedUrl.initialize('http://example.com/', "example").then((su) => {

        expect(su).to.not.be.null;

        expect(su.url).to.be.equal('http://example.com/');
        expect(su.shortcode).to.be.equal("example");
        expect(Date.parse(su.startDate)).to.not.be.equal(NaN);
        expect(Date.parse(su.lastSeenDate)).to.not.be.equal(NaN);
        expect(parseInt(su.redirectCount)).to.not.be.equal(NaN);
        expect(su.redirectCount).be.equal(0);
      
        done();

      }).catch((err) => {
      });
    });
    it('should return null with invalid shortcode', function(done) {
      ShortenedUrl.initialize('http://example.com/', "e").then((su) => {
        expect(su).to.be.null;
        done();
      }).catch((err) => {
      });
    });
    it('should return null with invalid url and shortcode', function(done) {
      ShortenedUrl.initialize('', '').then((su) => {
        expect(su).to.be.null;
        done();
      }).catch((err) => {
      });
    });
    it('should return null with empty shortcode', function(done) {
      ShortenedUrl.initialize('http://example.com/', '').then((su) => {
        expect(su).to.be.null;
        done();
      }).catch((err) => {
      });
    });
    it('should return null with invalid url', function(done) {
      ShortenedUrl.initialize('', 'example').then((su) => {
        expect(su).to.be.null;
        done();
      }).catch((err) => {
      });
      
    });
  })


  describe('"generateShortcode"', () => {
    it('should export a function', () => {
      expect(ShortenedUrl.generateShortcode).to.be.a('function')
    })
    it('should generate a valid shortcode', function(done) {
      expect(ShortenedUrl.generateShortcode()).to.be.match(/^[0-9a-zA-Z_]{6}$/);
      done();

    });
  })

  describe('"validateShortcode"', () => {

    it('should export a function', () => {
      expect(ShortenedUrl.validateShortcode).to.be.a('function')
    })
    it('should validate a valid shortcode', function(done) {
      expect(ShortenedUrl.validateShortcode("example")).to.be.true;
      done();

    });
    it('should not validate an invalid shortcode', function(done) {
      expect(ShortenedUrl.validateShortcode("e")).to.be.false;
      done();

    });
  })  
})