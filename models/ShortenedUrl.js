var Promise = require("bluebird");
var mongoose = require('mongoose')
  , Schema = mongoose.Schema;
var RandExp = require('randexp');

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

function isShortcodeValid(shortcode) {
  return shortcodeRegex.test(shortcode);
};


function isBlank(str) {
  return (str == undefined || str == null || str.replace(/\s/g, '') == '') 
};

function generateShortcode() {
  // this will make it O(n)
  // shortid has fixed size, hashis needs a random value to start and doesnt guarantee there are no conflicts, so i just need to check in db for now
  return new RandExp(shortcodeRegex).gen();
};

ShortenedUrlSchema.statics.shortenUrl = function(url, preferentialShortcode) {
  // if(!isBlank(url)) {
  //   console.error("url is not present");
  //   return null;
  // }
  
  // if(isBlank(preferentialShortcode)) {

    


  // } 



  // return this.retrieveUrl(preferentialShortcode).then((retrieved) => {
  // if(retrieved) {
  //   return null;
  // } else {


  // }

  // });  
  // } 
  if(preferentialShortcode && !isShortcodeValid(preferentialShortcode)) {
    return {status: 422, message: "The shortcode fails to meet the following regexp:" + shortcodeRegex};
  }
  var now = Date.now();
  var attemptCode = preferentialShortcode;
  if(isBlank(attemptCode)) {
    attemptCode = generateShortcode();
  }
  var shortenedUrl = new this({
    url: url,
    shortcode: attemptCode,
    startDate: now,
    lastSeenDate: now,
    redirectCount:0
  });
  console.log("shortenedUrl");
  return shortenedUrl.save().then((result) => {
    console.log(result.shortcode);

    return {status: 201, message: {"shortcode": result.shortcode}};
  }).catch((error) => {

    console.log(error.toJSON());
    console.error("ERROR while saving");
    return {status: 409, message: "The the desired shortcode is already in use. Shortcodes are case-sensitive."};
  })
  
};

ShortenedUrlSchema.statics.retrieveUrl = function(shortcode) {
  console.log("retrieveUrl:", shortcode);

  if(!isShortcodeValid(shortcode)) {

    console.error("shortcode not valid");
    return null;

  }

  if(shortcode) {
    return this.findOne({"shortcode": shortcode}).then((shortenedUrl) => {
      if(shortenedUrl) {
        console.log(shortenedUrl);
        return shortenedUrl;
      } else {
        console.error("not found");
        return null;
      }

    }).catch((error) => {
      console.error(error);
      return null;
    });  
  } else {
    return null;  
  }
  
};

ShortenedUrlSchema.statics.retrieveStats = function(shortcode) {
};



module.exports = mongoose.model('ShortenedUrl', ShortenedUrlSchema);
