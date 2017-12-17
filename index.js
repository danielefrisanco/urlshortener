
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
console.log("remove error messages, only status code")


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
  	return res.status(415).end();
  }

  if(!req.body.url) {
		return res.status(400).end();

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
  res.setHeader('Content-Type', 'application/json')

  retrieveUrl(req.params.shortcode).then((shortenedUrl) => {
    if(shortenedUrl) {
      res.setHeader('Location', shortenedUrl.url);
      return res.status(302).end();
    }
    return res.status(404).end();
  }).catch((error) => {
    console.error(error);
    return res.status(404).end();
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

  retrieveShortenedUrl(req.params.shortcode).then((shortenedUrl) => {
    if(shortenedUrl) {
      var response = {
        "startDate": shortenedUrl.startDate,
        "lastSeenDate": shortenedUrl.lastSeenDate,
        "redirectCount": shortenedUrl.redirectCount
      };
      return res.status(302).send(JSON.stringify(response));
    }
    return res.status(404).end();
  }).catch((error) => {
    console.error(error);
    return res.status(404).end();
  });
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
    return retrieveShortenedUrl(shortcode).then((shortenedUrl) => {
      if(shortenedUrl) {
        shortenedUrl.lastSeenDate = new Date();
        shortenedUrl.redirectCount = shortenedUrl.redirectCount + 1;
        return shortenedUrl.save();
      } else {
        return Promise.resolve(undefined);
      }
    // }).then((shortenedUrl) => {
    //   if(shortenedUrl) {
    //     return {status: 302, message: {"url": shortenedUrl.url}};
    //   // } else {
    //   //   console.error("not found");
    //   //   return {status: 404, message: {"error": "The shortcode cannot be found in the system"}};
    //   }

    }).catch((error) => {
      console.error(error);
      // return {status: 404, message: {"error": "The shortcode cannot be found in the system"}};
    });  
  // } else {
  //   console.log("retrieveUrlretrieveUrlssss")
  //   return {status: 404, message: {"error": "The shortcode cannot be found in the system"}};  
  }
  
        return Promise.resolve(undefined);
  // return Promise.resolve({status: 404, message: {"error": "The shortcode cannot be found in the system"}});  
    
};








function retrieveShortenedUrl(shortcode) {

  if(ShortenedUrl.isShortcodeValid(shortcode)) {
    return ShortenedUrl.findOne({shortcode: shortcode}).then((shortenedUrl) => {
      if(shortenedUrl) {
        return shortenedUrl;
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
  
  return Promise.resolve(undefined);  
    
};










app.listen(8080);
app.use(express.static(path.join(__dirname, 'static')));
