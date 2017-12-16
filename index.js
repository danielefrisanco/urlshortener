
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
	var result = ShortenedUrl.shortenUrl(req.body.url, req.body.shortcode);
  if(result) {
  	return res.status(result.status).send(JSON.stringify(result.message));
  }

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
  console.log(req.body)
  res.send(res);

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

app.listen(8080);
app.use(express.static(path.join(__dirname, 'static')));
