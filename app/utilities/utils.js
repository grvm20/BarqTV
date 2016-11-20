'use strict';

const _ = require('underscore');
const InvalidInputException = require("../exceptions/invalid-input-exception");

/***
 * Utility class for app
 ***/

var isEmptyObject = (object) => {
  var doesNotHaveKeys = Object.keys(object).length === 0;
  return doesNotHaveKeys;
}

class Utils {

  static isEmpty(val) {
    var isUndefined = typeof val === 'undefined';
    var isNull = val === null;
    var isString = typeof val === 'string';
    var isObject = typeof val === 'object';

    if (isUndefined ||  isNull) {
      return true;
    } else if (isString) {
      var hasJustSpaces = val.trim().length === 0;
      return hasJustSpaces;
    } else if (isObject) {
      return isEmptyObject(val);
    } else {
      // Default case, for the rest of the datatypes.
      return false;
    }
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

  static validateAttributesNotEmpty(attributeKeys, object) {
    _.each(attributeKeys, (attribute) => {
      var hasAttribute = typeof object[attribute] !== 'undefined';
      var isValidAttribute = this.isValid(object[attribute]);
      if (!hasAttribute ||  !isValidAttribute) {
        throw new InvalidInputException(attribute);
      }
    });
  }

  // Alphabetic strings can contain . and , too.
  static isAlphabeticString(string) {
    var isNotEmpty = !Utils.isEmpty(string);
    var doesNotContainDigits = !Utils.CONTAINS_DIGIT_REGEX.test(string);
    var doesNotContainInvalidChars = !/[\{\}\(\)_\$#"'@\|!\?\+\*%<>/]/.test(string);
    return isNotEmpty && doesNotContainDigits && doesNotContainInvalidChars;
  }

  static isUuidString(string) {
    return Utils.VALID_UUID_REGEX.test(string);
  }

  static isEmailString(string) {
    return Utils.VALID_EMAIL_REGEX.test(string);
  }
}
// Class constants.
Utils.CONTAINS_DIGIT_REGEX = /.*[0-9].*/;
Utils.VALID_EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
Utils.VALID_UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

module.exports = Utils;
