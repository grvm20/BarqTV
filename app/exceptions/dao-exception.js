'use strict';

const Exception = require('./exception');

module.exports = class DaoException extends Exception {
  constructor (err) {
    super("Dao Exception has occured: " + err);
    this.err = err;
  }
}
