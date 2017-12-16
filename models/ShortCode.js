var Promise = require("bluebird");
var mongoose = require('mongoose')
  , Schema = mongoose.Schema;

mongoose.Promise = global.Promise;

var ShortCodeSchema = new mongoose.Schema({
  id: mongoose.Schema.ObjectId,
  url: {type: Schema.Types.Mixed, index: true},
  shortcode: {type: Schema.Types.Mixed, index: true},
  startDate: Schema.Types.Mixed,
  lastSeenDate: Schema.Types.Mixed,
  redirectCount: {type: Number, default: 0}
});


ShortCodeSchema.statics.generateShortCode = function(url, preferentialShortcode) {
};


ShortCodeSchema.methods.retrieveUrl = function(shortcode) {
};

ShortCodeSchema.methods.retrieveStats = function(shortcode) {
};


function a(a) {
  return a;
}


module.exports = mongoose.model('ShortCode', ShortCodeSchema);
