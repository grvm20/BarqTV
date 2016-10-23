'use strict';

const Exception = require('./exception');

/***
* Exception class. To be used when Data Object accessed is not found
***/
module.exports = class SaoException extends Exception {
  constructor (err) {
    super("SAO Exception has occured: " + err);
    this.err = err;
  }
}
