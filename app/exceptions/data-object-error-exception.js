'use strict';

const Exception = require('./exception');

/***
* Exception class. To be used when Data Object accessed is not found
***/
module.exports = class DataObjectErrorException extends DaoException {
  constructor (err) {
    super("Object not found in your data model, error thrown: " + err);
    this.err = err;
  }
}
