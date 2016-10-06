'use strict';

const _ = require('underscore');

/***
 * Utility class for app
 ***/
class Utils {

  static isEmpty (val) {
    return _.isEmpty( (val && val.trim)? val.trim() : val );
  }

  static generateGuid() {
    // This is pseudo GUID. No clean way of getting GUID in JS
    var id = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0,
      v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });

    return id;
  }

  static isValid(object) {
    if (typeof object !== 'undefined') {
      var isValid = true;
      if (typeof object.validate === 'function') {
        var validationOutput = object.validate();
        if (typeof validationOutput === 'boolean') {
          var isValid = isValid && (validationOutput === true);
        }
      }
      if (typeof object.isValid === 'function') {
        var validationOutput = object.isValid();
        if (typeof validationOutput === 'boolean') {
          var isValid = isValid && (validationOutput === true);
        }
      }
      return isValid;
    } else {
      return false;
    }
  }
}

// Class constants.
Utils.CONTAINS_DIGIT_REGEX = /.*[0-9].*/;
Utils.VALID_EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

module.exports = Utils;