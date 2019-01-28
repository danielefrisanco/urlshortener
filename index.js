var express = require('express')
var mongoose = require('mongoose')
var bodyParser = require('body-parser')
var path = require('path')
// var http = require('http')
var config = {}
var short = require('./short')
var app = express()

module.exports = app

config.mongoURI = {
  development: 'mongodb://mongo/shorty-dev',
  test: 'mongodb://mongo/shorty-test'
}

mongoose.connect(
  config.mongoURI[app.settings.env],
  {
    useMongoClient: true,
    socketTimeoutMS: 0,
    keepAlive: true,
    reconnectTries: 30
  }
).then((db) => {
  console.log('Connected to database')

  app.use(bodyParser.urlencoded({
    extended: false
  }))

  app.use(bodyParser.json())

  app.post('/shorten', short.shorten)
  app.get('/:shortcode', short.shortcode)
  app.get('/:shortcode/stats', short.shortcode_stats)

  app.listen(8080)
  app.use(express.static(path.join(__dirname, 'static')))
}).catch((error) => {
  console.error(error)
})
