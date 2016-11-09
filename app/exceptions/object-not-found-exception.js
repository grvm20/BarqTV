'use strict';

const DaoException = require('./dao-exception');

/***
* Exception class. To be used when Data Object accessed is not found
***/
module.exports = class ObjectNotFoundException extends DaoException {
  constructor () {
    super("Object not found in your data model");
  }
}
