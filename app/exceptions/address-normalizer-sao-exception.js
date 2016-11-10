'use strict';

const Exception = require('./exception');

module.exports = class AddressNormalizerSaoException extends Exception {
  constructor (err) {
    super("AddressNormalizerSao Exception has occured: " + err);
    this.err = err;
  }
}