'use strict';

const DaoException = require('./dao-exception');

module.exports = class ObjectNotFoundException extends DaoException {
  constructor () {
    super("Object not found in your data model");
  }
}
