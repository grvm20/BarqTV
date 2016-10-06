'use strict';

const Exception = require('./exception');

/***
* Exception class. To be used when validating input
***/
module.exports = class InvalidInputException extends Exception {
  constructor (field) {
    super("Invalid " + field);
    this.field = field;
  }
}
