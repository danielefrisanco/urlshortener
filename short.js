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
exports.shorten = async function (req, res) {
  res.setHeader('Content-Type', 'application/json')

  if (!req.body || !req.body.url || shortHelper.isBlank(req.body.url)) {
    return res.status(constants.URL_NOT_PRESENT).end()
  }
  result = await shortHelper.shortenUrl(req.body.url, req.body.shortcode)
  if (result.status === constants.SHORTEN_URL_CREATED) {
    return res.status(result.status).json({ 'shortcode': result.shortcode })
  } else {
    return res.status(result.status).end()
  }
}

/**
  * @api {get} GET /:shortcode
  * @apiName
  * @apiDescription GET /:shortcode
  *
  * @apiSuccess {string}
  * @apiError {string}
  */
exports.shortcode = async function (req, res) {
  res.setHeader('Content-Type', 'application/json')

  result = await shortHelper.retrieveUrl(req.params.shortcode)
  if (result.status === constants.SHORTCODE_FOUND) {
    res.setHeader('Location', result.url)
    return res.status(result.status).end()
  } else {
    return res.status(constants.SHORTCODE_NOT_FOUND).end()
  }
}

/**
* @api {get} GET /:shortcode/stats
* @apiName
* @apiDescription GET /:shortcode/stats
*
* @apiSuccess {string}
* @apiError {string}
*/
exports.shortcode_stats = async function (req, res) {
  res.setHeader('Content-Type', 'application/json')

  result = await shortHelper.retrieveShortenedUrl(req.params.shortcode)
  if (result.status === constants.SHORTEN_URL_FOUND) {
    var response = {
      'startDate': result.shortenedUrl.startDate,
      'lastSeenDate': result.shortenedUrl.lastSeenDate,
      'redirectCount': result.shortenedUrl.redirectCount
    }
    return res.status(result.status).json(response)
  } else {
    return res.status(constants.SHORTCODE_NOT_FOUND).end()
  }
}
