
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var path = require('path');
var http = require('http');

//Models
var ShortenedUrl = require("./models/ShortenedUrl.js");

mongoose.connect('mongodb://localhost');//.set('debug', true);

var app = express();

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
  console.log(req.body.url)
  console.log(req.body.shortcode)
  res.setHeader('Content-Type', 'application/json')
  if(!req.body) {
  	return res.status(415).send(JSON.stringify({"error": "body not present"}));
  }

  if(!req.body.url) {
		return res.status(400).send(JSON.stringify({"error": "url is not present"}));

  } 

 

console.log("explain result: why it was easier for me to return status from the model")
	shortenUrl(req.body.url, req.body.shortcode).then((result) => {
	  if(result) {
	    console.error(result);
	  	return res.status(result.status).send(JSON.stringify(result.message));
	  }
		
	});

	// return res.status(201).send(JSON.stringify({result}));

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
  retrieveUrl(req.params.shortcode).then((result) => {
    if(result && result.message.url) {
      res.setHeader('Location', result.message.url);
      return res.status(result.status).end();
    }
    return res.status(result.status).send(JSON.stringify(result.message));
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
  console.log(req.body)
  res.send(res);

});



function shortenUrl(url, preferentialShortcode) {
  console.log("put this in controller")
  if(preferentialShortcode && !ShortenedUrl.isShortcodeValid(preferentialShortcode)) {
    return Promise.resolve({status: 422, message: {"error": "The shortcode fails to meet the following regexp:" + ShortenedUrl.getShortcodeRegex()}});
  }
  var attemptCode = preferentialShortcode;
  if(ShortenedUrl.isBlank(attemptCode)) {
    attemptCode = ShortenedUrl.generateShortcode();
      
    
  }
  return ShortenedUrl.findOne({shortcode: attemptCode}).then((shortenedUrl) => {

    return (shortenedUrl == null);
  }).then((attemptCodeIsNotPresent) => {
    if(attemptCodeIsNotPresent) {

      return ShortenedUrl.initialize(url, attemptCode).then((shortenedUrl) => {
        if(shortenedUrl) {
          return {status: 201, message: {"shortcode": shortenedUrl.shortcode}};

        }
      })
    }
    return {status: 409, message: {"error": "The the desired shortcode is already in use. Shortcodes are case-sensitive."}};

  }).catch((error) => {
    console.log(error);
    console.error("ERROR while saving");
    return {status: 409, message: {"error": "The the desired shortcode is already in use. Shortcodes are case-sensitive."}};
  })

};











function retrieveUrl(shortcode) {

  if(ShortenedUrl.isShortcodeValid(shortcode)) {
    return ShortenedUrl.findOne({shortcode: shortcode}).then((shortenedUrl) => {
      if(shortenedUrl) {
        return {status: 302, message: {"url": shortenedUrl.url}};
      // } else {
      //   console.error("not found");
      //   return {status: 404, message: {"error": "The shortcode cannot be found in the system"}};
      }

    }).catch((error) => {
      console.error(error);
      // return {status: 404, message: {"error": "The shortcode cannot be found in the system"}};
    });  
  // } else {
  //   console.log("retrieveUrlretrieveUrlssss")
  //   return {status: 404, message: {"error": "The shortcode cannot be found in the system"}};  
  }
  
  return Promise.resolve({status: 404, message: {"error": "The shortcode cannot be found in the system"}});  
    
};










app.listen(8080);
app.use(express.static(path.join(__dirname, 'static')));
