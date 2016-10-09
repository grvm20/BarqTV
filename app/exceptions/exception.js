'use strict';

/***
 * Exception class. Other exceptions should inherit from it.
 ***/
module.exports = class Exception extends Error {
  constructor (message) {
    // Because of the special structure of Error object, we have to construct it
    // this way. For more info, check:
    // http://stackoverflow.com/questions/8802845/inheriting-from-the-error-object-where-is-the-message-property/17936621#17936621
    super(message);
    this.name = this.constructor.name;
    this.message = message;
    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, this.constructor);
    } else {
      this.stack = (new Error(message)).stack;
    }
  }
}
