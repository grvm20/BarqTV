'use strict';

const DaoException = require('./dao-exception');

module.exports = class ObjectExistsException extends DaoException {
  constructor (err) {
    super("The object already exists in DAO: " + err);
    this.err = err;
    console.log("ObjectExistsException invoked with Error " + err);
  }
}
