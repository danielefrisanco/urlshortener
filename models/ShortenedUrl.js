var Promise = require("bluebird");
var mongoose = require('mongoose')
  , Schema = mongoose.Schema;
var RandExp = require('randexp');
var uniqueValidator = require('mongoose-unique-validator');
mongoose.Promise = global.Promise;

const shortcodeRegex = /^[0-9a-zA-Z_]{6}$/;

var ShortenedUrlSchema = new mongoose.Schema({
  id: mongoose.Schema.ObjectId,
  url: {type: String, index: true, validate: /^(?!\s*$).+/},
  shortcode: {type: String, index: true, unique: true, validate: shortcodeRegex},
  startDate: Schema.Types.Mixed,
  lastSeenDate: Schema.Types.Mixed,
  redirectCount: {type: Number, default: 0}
});
ShortenedUrlSchema.plugin(uniqueValidator);
console.log("do i still need uniqueValidator?? mongoose-unique-validator");


ShortenedUrlSchema.statics.isShortcodeValid = function(shortcode) {
  return (typeof shortcode === "string") && shortcodeRegex.test(shortcode);
};

ShortenedUrlSchema.statics.isBlank = function(str) {
  return (str == undefined || str == null || str.replace(/\s/g, '') == '') 
};

ShortenedUrlSchema.statics.generateShortcode = function() {
  console.log("TODO generate unique shortcode even though there are around 51520374361 of permutations possible")
  // this will make it O(n)
  // shortid has fixed size, hashis needs a random value to start and doesnt guarantee there are no conflicts, so i just need to check in db for now
  return new RandExp(shortcodeRegex).gen();
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
    // console.log(error.toJSON());
    console.error("ERROR while saving1");
    return null; //{status: 409, message: {"error": "The the desired shortcode is already in use. Shortcodes are case-sensitive."}};
  })

};

ShortenedUrlSchema.statics.getShortcodeRegex = function() {
  return shortcodeRegex;
}

module.exports = mongoose.model('ShortenedUrl', ShortenedUrlSchema);
