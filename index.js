
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
  extended: true
}));

app.use(bodyParser.json());
 


//   check header



	/**
	* @api {get} POST /shorten
	* @apiName
	* @apiDescription POST /shorten
	*
	* @apiSuccess {string} 
	* @apiError {string}
	*/
app.post('/shorten', function(req, res) {
  console.log(req.body)
  res.send("res");

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
