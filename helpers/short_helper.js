var ShortenedUrl = require('../models/ShortenedUrl.js')
var constants = require('../lib/constants')

/**
* Checks if string is empty
* param {string}
* return {boolean}
*/
function isBlank (str) {
  return (str === undefined || str === null || str.replace(/\s/g, '') === '')
}

/**
* Given a url returns a shortened code for it, or uses the one suggested
* param {string}
* param {string}
* return {string}
*/
async function shortenUrl (url, preferentialShortcode) {
  if (isPreferentialShortcodeInvalid(preferentialShortcode)) {
    return { status: constants.SHORTCODE_NOT_VALID }
  }
  attemptCode = preferentialShortcode
  if (isBlank(attemptCode)) {
    attemptCode = ShortenedUrl.generateShortcode()
  }

  shortenedUrl = await ShortenedUrl.findByShortcode(attemptCode)
  if (!shortenedUrl) {
    shortenedUrl = await ShortenedUrl.initialize(url, attemptCode)
    if (shortenedUrl) {
      return { status: constants.SHORTEN_URL_CREATED, shortcode: shortenedUrl.shortcode }
    }
  }
  return { status: constants.SHORTCODE_ALREADY_USED }
}

/**
* Given a shortened code returns the mapped url and logs the access
* param {string}
* return {string}
*/
async function retrieveUrl (shortcode) {
  result = await retrieveShortenedUrl(shortcode)
  if (result.status === constants.SHORTEN_URL_FOUND) {
    // move this to another fun
    result.shortenedUrl.lastSeenDate = new Date()
    result.shortenedUrl.redirectCount = result.shortenedUrl.redirectCount + 1
    shortenedUrl = await result.shortenedUrl.save()
    return { status: constants.SHORTCODE_FOUND, url: shortenedUrl.url }
  } else {
    return { status: constants.SHORTCODE_NOT_FOUND }
  }
}

/**
* Given a shortened code returns the mapped url
* param {string}
* return {string}
*/
async function retrieveShortenedUrl (shortcode) {
  shortenedUrl = await ShortenedUrl.findByShortcode(shortcode)
  if (shortenedUrl) {
    return { status: constants.SHORTEN_URL_FOUND, shortenedUrl: shortenedUrl }
  } else {
    return { status: constants.SHORTCODE_NOT_FOUND }
  }
}

exports.isBlank = isBlank
exports.shortenUrl = shortenUrl
exports.retrieveUrl = retrieveUrl
exports.retrieveShortenedUrl = retrieveShortenedUrl

function isPreferentialShortcodeInvalid (preferentialShortcode) {
  return (!isBlank(preferentialShortcode) && !ShortenedUrl.validateShortcode(preferentialShortcode))
}
