'use strict';

/***
 * Exception class. Other exceptions should inherit from it.
 ***/
module.exports = class Exception {
  constructor (message) {
    this.message = message;
  }
}