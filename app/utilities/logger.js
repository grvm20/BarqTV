'use strict';

module.exports = class Logger {
  static log(message) {
    console.log(message);
  }

  static error(message) {
    console.error(message);
  }
}