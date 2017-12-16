var Promise = require("bluebird");
var mongoose = require('mongoose')
  , Schema = mongoose.Schema;
var RandExp = require('randexp');

mongoose.Promise = global.Promise;

var ShortenedUrlSchema = new mongoose.Schema({
  id: mongoose.Schema.ObjectId,
  url: {type: Schema.Types.Mixed, index: true},
  shortcode: {type: Schema.Types.Mixed, index: true},
  startDate: Schema.Types.Mixed,
  lastSeenDate: Schema.Types.Mixed,
  redirectCount: {type: Number, default: 0}
});

function validateShortcode(shortcode) {
  return /^[0-9a-zA-Z_]{6}$/.test(shortcode);
};


function generateShortcode() {
  // this will make it O(n)
  // shortid has fixed size, hashis needs a random value to start and doesnt guarantee there are no conflicts, so i just need to check in db for now
  return new RandExp(/^[0-9a-zA-Z_]{6}$/).gen();
};

ShortenedUrlSchema.statics.shortenUrl = function(url, preferentialShortcode) {
  if(url) {  
    return this.retrieveUrl(preferentialShortcode).then((retrieved) => {
      if(retrieved) {
        return  null;
      } else {

      }

    });
  } else {
    console.error("url is not present");
    return null;
  }
};

ShortenedUrlSchema.statics.retrieveUrl = function(shortcode) {
  console.log("retrieveUrl:", shortcode);
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
