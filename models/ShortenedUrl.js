var Promise = require("bluebird");
var mongoose = require('mongoose')
  , Schema = mongoose.Schema;
var RandExp = require('randexp');
var uniqueValidator = require('mongoose-unique-validator');
mongoose.Promise = global.Promise;

const SHORTCODE_REGEX = /^[0-9a-zA-Z_]{6}$/;
const MINIMUM_SHORTCODE_REGEX = /^[0-9a-zA-Z_]{4,}$/;
var ShortenedUrlSchema = new mongoose.Schema({
  id: mongoose.Schema.ObjectId,
  url: {type: String, index: true, validate: /^(?!\s*$).+/},
  shortcode: {type: String, index: true, unique: true},
  startDate: Schema.Types.Mixed,
  lastSeenDate: Schema.Types.Mixed,
  redirectCount: {type: Number, default: 0}
});

ShortenedUrlSchema.plugin(uniqueValidator);

ShortenedUrlSchema.statics.validateShortcode = function(shortcode) {
  return MINIMUM_SHORTCODE_REGEX.test(shortcode);
};

ShortenedUrlSchema.statics.generateShortcode = function() {
  return new RandExp(SHORTCODE_REGEX).gen();
};


ShortenedUrlSchema.statics.initialize = function(url, shortcode) {
  
  var now = new Date();
  var shortenedUrl = new this({
    url: url,
    shortcode: shortcode,
    startDate: now,
    lastSeenDate: now,
    redirectCount: 0
  });

  return shortenedUrl.save().then((result) => {
    if(result) {
      return result;
    } else {
      return null;
    }
  }).catch((error) => {
    console.log(error);
    return null; 
  })

};

ShortenedUrlSchema.statics.getShortcodeRegex = function() {
  return SHORTCODE_REGEX;
}

module.exports = mongoose.model('ShortenedUrl', ShortenedUrlSchema);
