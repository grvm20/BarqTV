'use strict';

const _ = require('underscore');

/***
 * Utility class for app
 ***/
class Utils {

  static isEmpty (val) {
    return _.isEmpty( (val && val.trim)? val.trim() : val );
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

  static validateAttributesNotEmpty(attributeKeys, object){
    _.each(attributeKeys, (attribute) => {
        var hasAttribute = typeof object[attribute] !== 'undefined';
        var isValidAttribute = this.isValid(object[attribute]);
        if (!hasAttribute || !isValidAttribute) {
          throw new InvalidInputException(attribute);
        }
    });
  }
}

// Class constants.
Utils.CONTAINS_DIGIT_REGEX = /.*[0-9].*/;
Utils.VALID_EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

module.exports = Utils;