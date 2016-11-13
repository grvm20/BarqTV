'use strict';

const AddressNormalizerSaoException = require('./address-normalizer-sao-exception');

module.exports = class AddressNotSpecificException extends AddressNormalizerSaoException {
  constructor (err) {
    super("Address is not specific enough. Please add more details " + err);
    this.err = err;
  }
}