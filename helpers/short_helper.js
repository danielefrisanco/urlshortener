var ShortenedUrl = require('../models/ShortenedUrl.js')
var constants = require('../lib/constants')

function isBlank (str) {
  return (str === undefined || str === null || str.replace(/\s/g, '') === '')
}

function shortenUrl (url, preferentialShortcode) {
  if (!isBlank(preferentialShortcode) && !ShortenedUrl.validateShortcode(preferentialShortcode)) {
    return Promise.resolve({ status: constants.SHORTCODE_NOT_VALID })
  }
  var attemptCode = preferentialShortcode
  if (isBlank(attemptCode)) {
    attemptCode = ShortenedUrl.generateShortcode()
  }
  return ShortenedUrl.findOne({ shortcode: attemptCode }).then((shortenedUrl) => {
    return (shortenedUrl === null)
  }).then((attemptCodeIsNotPresent) => {
    if (attemptCodeIsNotPresent) {
      return ShortenedUrl.initialize(url, attemptCode)
    }
  }).then((shortenedUrl) => {
    if (shortenedUrl) {
      return { status: constants.SHORTEN_URL_CREATED, shortcode: shortenedUrl.shortcode }
    }
    return { status: constants.SHORTCODE_ALREADY_USED }
  }).catch((error) => {
    console.error(error)
    return { status: constants.SHORTCODE_ALREADY_USED }
  })
}

function retrieveUrl (shortcode) {
  return retrieveShortenedUrl(shortcode).then((result) => {
    if (result.status === constants.SHORTEN_URL_FOUND) {
      result.shortenedUrl.lastSeenDate = new Date()
      result.shortenedUrl.redirectCount = result.shortenedUrl.redirectCount + 1
      return result.shortenedUrl.save()
    } else {
      return Promise.reject({ status: constants.SHORTCODE_NOT_FOUND })
    }
  }).then((shortenedUrl) => {
    return { status: constants.SHORTCODE_FOUND, url: shortenedUrl.url }
  }).catch((error) => {
    console.error(error)
    return Promise.reject({ status: constants.SHORTCODE_NOT_FOUND })
  })
}

function retrieveShortenedUrl (shortcode) {
  return ShortenedUrl.findOne({ shortcode: shortcode }).then((shortenedUrl) => {
    if (shortenedUrl) {
      return { status: constants.SHORTEN_URL_FOUND, shortenedUrl: shortenedUrl }
    } else {
      return Promise.reject({ status: constants.SHORTCODE_NOT_FOUND })
    }
  }).catch((error) => {
    console.error(error)
    return Promise.reject({ status: constants.SHORTCODE_NOT_FOUND })
  })
}

exports.isBlank = isBlank
exports.shortenUrl = shortenUrl
exports.retrieveUrl = retrieveUrl
exports.retrieveShortenedUrl = retrieveShortenedUrl
