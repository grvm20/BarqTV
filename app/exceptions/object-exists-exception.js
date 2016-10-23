'use strict';

const Exception = require('./exception');

/***
* Exception class. To be used when Data Object accessed is not found
***/
module.exports = class ObjectExistsException extends DaoException {
  constructor (err) {
    super("The object already exists in DAO: " + err);
    this.err = err;
  }
}
