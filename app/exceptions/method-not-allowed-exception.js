'use strict';

const DaoException = require('./dao-exception');

module.exports = class MethodNotAllowedException extends DaoException {
  constructor (err) {
    super("This method is not allowed, error thrown: " + err);
    this.err = err;
  }
}
