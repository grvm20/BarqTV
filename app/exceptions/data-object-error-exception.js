'use strict';

const DaoException = require('./dao-exception');

module.exports = class DataObjectErrorException extends DaoException {
  constructor (err) {
    super("Object not found in your data model, error thrown: " + err);
    this.err = err;
  }
}
