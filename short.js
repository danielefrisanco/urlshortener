var constants = require('./lib/constants')
var shortHelper = require('./helpers/short_helper')
/**
  * @api {get} POST /shorten
  * @apiName
  * @apiDescription POST /shorten
  *
  * @apiSuccess {string}
  * @apiError {string}
  */
exports.shorten = function (req, res) {
  res.setHeader('Content-Type', 'application/json')

  if (!req.body || !req.body.url || shortHelper.isBlank(req.body.url)) {
    return res.status(constants.URL_NOT_PRESENT).end()
  }
  return shortHelper.shortenUrl(req.body.url, req.body.shortcode).then((result) => {
    if (result.status === constants.SHORTEN_URL_CREATED) {
      return res.status(result.status).send(JSON.stringify({ 'shortcode': result.shortcode }))
    }
    return res.status(result.status).end()
  })
}

/**
  * @api {get} GET /:shortcode
  * @apiName
  * @apiDescription GET /:shortcode
  *
  * @apiSuccess {string}
  * @apiError {string}
  */
exports.shortcode = function (req, res) {
  res.setHeader('Content-Type', 'application/json')

  shortHelper.retrieveUrl(req.params.shortcode).then((result) => {
    if (result.status === constants.SHORTCODE_FOUND) {
      res.setHeader('Location', result.url)
    }
    return res.status(result.status).end()
  }).catch((error) => {
    console.error(error)
    return res.status(constants.SHORTCODE_NOT_FOUND).end()
  })
}

/**
* @api {get} GET /:shortcode/stats
* @apiName
* @apiDescription GET /:shortcode/stats
*
* @apiSuccess {string}
* @apiError {string}
*/
exports.shortcode_stats = function (req, res) {
  res.setHeader('Content-Type', 'application/json')
  shortHelper.retrieveShortenedUrl(req.params.shortcode).then((result) => {
    if (result.status === constants.SHORTEN_URL_FOUND) {
      var response = {
        'startDate': result.shortenedUrl.startDate,
        'lastSeenDate': result.shortenedUrl.lastSeenDate,
        'redirectCount': result.shortenedUrl.redirectCount
      }
      return res.status(result.status).send(JSON.stringify(response))
    } else {
      return res.status(constants.SHORTCODE_NOT_FOUND).end()
    }
  }).catch((error) => {
    console.error(error)
    return res.status(constants.SHORTCODE_NOT_FOUND).end()
  })
}
