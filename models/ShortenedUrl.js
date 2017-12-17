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
console.log("do i still need uniqueValidator?? mongoose-unique-validator")
ShortenedUrlSchema.statics.isShortcodeValid = function(shortcode) {
  return shortcodeRegex.test(shortcode);
};


ShortenedUrlSchema.statics.isBlank = function(str) {
  return (str == undefined || str == null || str.replace(/\s/g, '') == '') 
};

ShortenedUrlSchema.statics.generateShortcode = function() {
  console.log("TODO generate unique shortcode")
  // this will make it O(n)
  // shortid has fixed size, hashis needs a random value to start and doesnt guarantee there are no conflicts, so i just need to check in db for now
  return new RandExp(shortcodeRegex).gen();
};

var isShortcodeValid = function(shortcode) {
  return shortcodeRegex.test(shortcode);
};


var isBlank = function(str) {
  return (str == undefined || str == null || str.replace(/\s/g, '') == '') 
};

var generateShortcode = function() {
  console.log("TODO generate unique shortcode")
  // this will make it O(n)
  // shortid has fixed size, hashis needs a random value to start and doesnt guarantee there are no conflicts, so i just need to check in db for now
  return new RandExp(shortcodeRegex).gen();
};



ShortenedUrlSchema.statics.initialize = function(url, shortcode) {
  
  var now = Date.now();
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




   
//   if(preferentialShortcode && !isShortcodeValid(preferentialShortcode)) {
//     return {status: 422, message: {"error": "The shortcode fails to meet the following regexp:" + shortcodeRegex}};
//   }
//   var now = Date.now();
//   var attemptCode = preferentialShortcode;
//   if(isBlank(attemptCode)) {
//     var attemptCodeAlreadyPresent = false;
//     do {
//       attemptCode = generateShortcode();
//       attemptCodeAlreadyPresent = this.retrieveUrl(attemptCode).then((result) => {
// console.log(result)
//         return (result && result.status == 302);
//       });
//     } while(attemptCodeAlreadyPresent);
//   }
//   var shortenedUrl = new this({
//     url: url,
//     shortcode: attemptCode,
//     startDate: now,
//     lastSeenDate: now,
//     redirectCount: 0
//   });

//   return shortenedUrl.save().then((result) => {
//     if(result) {
//       return {status: 201, message: {"shortcode": result.shortcode}};
//     } else {
//       return {status: 409, message: {"error": "The the desired shortcode is already in use. Shortcodes are case-sensitive."}};
//     }
//   }).catch((error) => {
//     // console.log(error.toJSON());
//     console.error("ERROR while saving");
//     return {status: 409, message: {"error": "The the desired shortcode is already in use. Shortcodes are case-sensitive."}};
//   })
  
};












// ShortenedUrlSchema.statics.retrieveUrl = function(shortcode) {
//   console.log("retrieveUrl:", shortcode);

//   if(!isShortcodeValid(shortcode)) {

//     console.error("shortcode not valid");
//     return {status: 1, message: {"url": ""}};

//   }

//   if(shortcode) {
//     console.log("retrieveUrlretrieveUrl",shortcode)
//     console.log("retrieveUrlretrieveUrl2",this)
//     return this.findOne({shortcode: shortcode}).then((shortenedUrl) => {
//       console.log(shortenedUrl)
//       if(shortenedUrl) {
//         console.log(shortenedUrl);
//         return {status: 302, message: {"url": shortenedUrl.url}};
//       } else {
//         console.error("not found");
//         return {status: 1, message: {"url": ""}};
//       }

//     }).catch((error) => {
//       console.error(error);
//       return {status: 1, message: {"url": ""}};
//     });  
//   } else {
//     console.log("retrieveUrlretrieveUrlssss")
//     return {status: 1, message: {"url": ""}};  
//   }
  
// };

ShortenedUrlSchema.statics.retrieveStats = function(shortcode) {
};



module.exports = mongoose.model('ShortenedUrl', ShortenedUrlSchema);
