var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var path = require('path');
var http = require('http');
var constants = require('./lib/constants');
//Models
var ShortenedUrl = require("./models/ShortenedUrl.js");
var config = {};

config.mongoURI = {
  development: 'mongodb://localhost/shorty-dev',
  test: 'mongodb://localhost/shorty-dev'
};
var app = express();

// module.exports = config;
console.log("fix env test/ ddev")
console.log(app.settings.env )
mongoose.connect(config.mongoURI[app.settings.env], function(err, res) {
  if(err) {
    console.log('Error connecting to the database. ' + err);
  } else {
    console.log('Connected to Database: ' + config.mongoURI[app.settings.env]);
  }
});
// mongoose.connect('mongodb://localhost');//.set('debug', true);



app.use(bodyParser.urlencoded({
  extended: false
}));

app.use(bodyParser.json());
console.log("make sure it is a json")


	/**
	* @api {get} POST /shorten
	* @apiName
	* @apiDescription POST /shorten
	*
	* @apiSuccess {string} 
	* @apiError {string}
	*/
app.post('/shorten', function(req, res) {
  res.setHeader('Content-Type', 'application/json')
 
  if(!req.body || !req.body.url || isBlank(req.body.url)) {
		return res.status(constants.URL_NOT_PRESENT).end();
  }
	return shortenUrl(req.body.url, req.body.shortcode).then((result) => {
    if(result.status == constants.SHORTEN_URL_CREATED) {
	  	return res.status(result.status).send(JSON.stringify({"shortcode": result.shortcode}));
	  }  
    return res.status(result.status).end();
  });
});


	/**
	* @api {get} GET /:shortcode
	* @apiName
	* @apiDescription GET /:shortcode
	*
	* @apiSuccess {string} 
	* @apiError {string}
	*/
app.get('/:shortcode', function(req, res) {
  res.setHeader('Content-Type', 'application/json')

  retrieveUrl(req.params.shortcode).then((result) => {
    if(result.status == constants.SHORTCODE_FOUND) {
      res.setHeader('Location', result.url);
    }
    return res.status(result.status).end();
  }).catch((error) => {
    console.error(error);
    return res.status(constants.SHORTCODE_NOT_FOUND).end();
  });
});


/**
* @api {get} GET /:shortcode/stats
* @apiName
* @apiDescription GET /:shortcode/stats
*
* @apiSuccess {string} 
* @apiError {string}
*/
app.get('/:shortcode/stats', function(req, res) {
  res.setHeader('Content-Type', 'application/json')
  retrieveShortenedUrl(req.params.shortcode).then((result) => {
    if(result.status == constants.SHORTEN_URL_FOUND) {
      var response = {
        "startDate": result.shortenedUrl.startDate,
        "lastSeenDate": result.shortenedUrl.lastSeenDate,
        "redirectCount": result.shortenedUrl.redirectCount
      };
      return res.status(result.status).send(JSON.stringify(response));
    } else {
      return res.status(constants.SHORTCODE_NOT_FOUND).end();
    }
  }).catch((error) => {
    console.error(error);
    return res.status(constants.SHORTCODE_NOT_FOUND).end();
  });
});


function isBlank(str) {
  return (str == undefined || str == null || str.replace(/\s/g, '') == '') 
};

function shortenUrl(url, preferentialShortcode) {
  console.log("put this in controller")

  if(!isBlank(preferentialShortcode) && !ShortenedUrl.validateShortcode(preferentialShortcode)) {
    return Promise.resolve({status: constants.SHORTCODE_NOT_VALID});
  }
  var attemptCode = preferentialShortcode;
  if(isBlank(attemptCode)) {
    attemptCode = ShortenedUrl.generateShortcode();    
  }
  return ShortenedUrl.findOne({shortcode: attemptCode}).then((shortenedUrl) => {
    return (shortenedUrl == null);
  }).then((attemptCodeIsNotPresent) => {
    if(attemptCodeIsNotPresent) {
      return ShortenedUrl.initialize(url, attemptCode).then((shortenedUrl) => {
        if(shortenedUrl) {
          return {status: constants.SHORTEN_URL_CREATED, shortcode: shortenedUrl.shortcode};
        }
      })
    }
    return {status: constants.SHORTCODE_ALREADY_USED};
  }).catch((error) => {
    console.log(error);
    return {status: constants.SHORTCODE_ALREADY_USED};
  })

};


function retrieveUrl(shortcode) {
  return retrieveShortenedUrl(shortcode).then((result) => {
    if(result.status == constants.SHORTEN_URL_FOUND) {
      result.shortenedUrl.lastSeenDate = new Date();
      result.shortenedUrl.redirectCount = result.shortenedUrl.redirectCount + 1;
      return result.shortenedUrl.save().then((shortenedUrl) => {
        return {status: constants.SHORTCODE_FOUND, url: shortenedUrl.url};
      });
    } else {
      return Promise.resolve({status: constants.SHORTCODE_NOT_FOUND});
    }
  }).catch((error) => {
    console.error(error);
    return Promise.resolve({status: constants.SHORTCODE_NOT_FOUND});
  });  
};


function retrieveShortenedUrl(shortcode) {
  return ShortenedUrl.findOne({shortcode: shortcode}).then((shortenedUrl) => {
    if(shortenedUrl) {
      return {status: constants.SHORTEN_URL_FOUND, shortenedUrl: shortenedUrl};
    } else {
      return Promise.resolve({status: constants.SHORTCODE_NOT_FOUND});  
    }
  }).catch((error) => {
    console.error(error);
    return Promise.resolve({status: constants.SHORTCODE_NOT_FOUND});  
  });  
};


app.listen(8080);
app.use(express.static(path.join(__dirname, 'static')));
module.exports = app;
