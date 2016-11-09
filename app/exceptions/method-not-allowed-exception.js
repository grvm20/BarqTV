'use strict';

const DaoException = require('./dao-exception');

/***
* Exception class. To be used when Data Object accessed is not found
***/
module.exports = class MethodNotAllowedException extends DaoException {
  constructor (err) {
    super("This method is not allowed, error thrown: " + err);
    this.err = err;
  }
}
