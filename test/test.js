
var ShortenedUrl = require("../models/ShortenedUrl.js");
const expect = require('chai').expect

describe('ShortenedUrl module', () => {
  describe('"getShortcodeRegex"', () => {
    it('should export a function', () => {
      expect(ShortenedUrl.getShortcodeRegex).to.be.a('function')
    })
  })


  describe('"initialize"', () => {
    it('should export a function', () => {
      expect(ShortenedUrl.initialize).to.be.a('function')
    })
  })


  describe('"generateShortcode"', () => {
    it('should export a function', () => {
      expect(ShortenedUrl.generateShortcode).to.be.a('function')
    })
  })


  describe('"isBlank"', () => {
    it('should export a function', () => {
      expect(ShortenedUrl.isBlank).to.be.a('function')
    })
  })


  describe('"isShortcodeValid"', () => {
    it('should export a function', () => {
      expect(ShortenedUrl.isShortcodeValid).to.be.a('function')
    })
  })
})