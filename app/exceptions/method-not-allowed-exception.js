'use strict';

const Exception = require('./exception');

/***
* Exception class. To be used when Data Object accessed is not found
***/
module.exports = class MethodNotAllowedException extends Exception {
  constructor (err) {
    super("This method is not allowed, error thrown: " + err);
    this.err = err;
  }
}
