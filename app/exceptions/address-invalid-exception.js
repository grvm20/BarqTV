'use strict';

const AddressNormalizerSaoException = require('./address-normalizer-sao-exception');

module.exports = class AddressInvalidException extends AddressNormalizerSaoException {
  constructor (err) {
    super("Address is not valid " + err);
    this.err = err;
  }
}