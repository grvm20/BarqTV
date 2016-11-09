'use strict';

const Exception = require('./exception');

/***
* Exception class. To be used when Data Object accessed is not found
***/
module.exports = class DaoException extends Exception {
  constructor (err) {
    super("Dao Exception has occured: " + err);
    this.err = err;
  }
}
