var ShortenedUrl = require("./models/ShortenedUrl.js");
var constants = require('./lib/constants');
  
  	/**
  	* @api {get} POST /shorten
  	* @apiName
  	* @apiDescription POST /shorten
  	*
  	* @apiSuccess {string} 
  	* @apiError {string}
  	*/
  exports.shorten = function(req, res) {
    res.setHeader('Content-Type', 'application/json')
   
    if(!req.body || !req.body.url || isBlank(req.body.url)) {
  		return res.status(constants.URL_NOT_PRESENT).end();
    }
  	return shortenUrl(req.body.url, req.body.shortcode).then((result) => {
      if(result.status == constants.SHORTEN_URL_CREATED) {
  	  	return res.status(result.status).send(JSON.stringify({"shortcode": result.shortcode}));
  	  }  
      return res.status(result.status).end();
    });
  }


  	/**
  	* @api {get} GET /:shortcode
  	* @apiName
  	* @apiDescription GET /:shortcode
  	*
  	* @apiSuccess {string} 
  	* @apiError {string}
  	*/
  exports.shortcode = function(req, res) {
    res.setHeader('Content-Type', 'application/json')

    retrieveUrl(req.params.shortcode).then((result) => {
      if(result.status == constants.SHORTCODE_FOUND) {
        res.setHeader('Location', result.url);
      }
      return res.status(result.status).end();
    }).catch((error) => {
      console.error(error);
      return res.status(constants.SHORTCODE_NOT_FOUND).end();
    });
  }


  /**
  * @api {get} GET /:shortcode/stats
  * @apiName
  * @apiDescription GET /:shortcode/stats
  *
  * @apiSuccess {string} 
  * @apiError {string}
  */
  exports.shortcode_stats = function(req, res) {
    console.log("aaaaaaaaaaaaaaaaa")
    res.setHeader('Content-Type', 'application/json')
    retrieveShortenedUrl(req.params.shortcode).then((result) => {
      if(result.status == constants.SHORTEN_URL_FOUND) {
        var response = {
          "startDate": result.shortenedUrl.startDate,
          "lastSeenDate": result.shortenedUrl.lastSeenDate,
          "redirectCount": result.shortenedUrl.redirectCount
        };
        return res.status(result.status).send(JSON.stringify(response));
      } else {
        return res.status(constants.SHORTCODE_NOT_FOUND).end();
      }
    }).catch((error) => {
      console.error(error);
      return res.status(constants.SHORTCODE_NOT_FOUND).end();
    });
  }


  function isBlank(str) {
    return (str == undefined || str == null || str.replace(/\s/g, '') == '') 
  };

  function shortenUrl(url, preferentialShortcode) {

    if(!isBlank(preferentialShortcode) && !ShortenedUrl.validateShortcode(preferentialShortcode)) {
      return Promise.resolve({status: constants.SHORTCODE_NOT_VALID});
    }
    var attemptCode = preferentialShortcode;
    if(isBlank(attemptCode)) {
      attemptCode = ShortenedUrl.generateShortcode();    
    }
    return ShortenedUrl.findOne({shortcode: attemptCode}).then((shortenedUrl) => {
      return (shortenedUrl == null);
    }).then((attemptCodeIsNotPresent) => {
      if(attemptCodeIsNotPresent) {
        return ShortenedUrl.initialize(url, attemptCode).then((shortenedUrl) => {
          if(shortenedUrl) {
            return {status: constants.SHORTEN_URL_CREATED, shortcode: shortenedUrl.shortcode};
          }
        })
      }
      return {status: constants.SHORTCODE_ALREADY_USED};
    }).catch((error) => {
      // console.log(error);
      return {status: constants.SHORTCODE_ALREADY_USED};
    })

  };


  function retrieveUrl(shortcode) {
    return retrieveShortenedUrl(shortcode).then((result) => {
      if(result.status == constants.SHORTEN_URL_FOUND) {
        result.shortenedUrl.lastSeenDate = new Date();
        result.shortenedUrl.redirectCount = result.shortenedUrl.redirectCount + 1;
        return result.shortenedUrl.save().then((shortenedUrl) => {
          return {status: constants.SHORTCODE_FOUND, url: shortenedUrl.url};
        });
      } else {
        return Promise.resolve({status: constants.SHORTCODE_NOT_FOUND});
      }
    }).catch((error) => {
      console.error(error);
      return Promise.resolve({status: constants.SHORTCODE_NOT_FOUND});
    });  
  };


  function retrieveShortenedUrl(shortcode) {
    return ShortenedUrl.findOne({shortcode: shortcode}).then((shortenedUrl) => {
      
      if(shortenedUrl) {
        return {status: constants.SHORTEN_URL_FOUND, shortenedUrl: shortenedUrl};
      } else {
        return Promise.resolve({status: constants.SHORTCODE_NOT_FOUND});  
      }
    }).catch((error) => {
      console.error(error);
      return Promise.resolve({status: constants.SHORTCODE_NOT_FOUND});  
    });  
  };
