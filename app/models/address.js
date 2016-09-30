'use strict';

const _ = require('underscore');
const InputValidationException = require("../exceptions/invalid-input-exception");
const Utils = require("../utilities/utils");

var ZIP_CODE_REGEX = /[0-9]{5,}$/;
var VALID_ADDRESS_REQUIRED_ATTRIBUTES = [
  "id",
  "city",
  "state",
  "apt",
  "number",
  "street",
  "zipCode"
];

/***
 * Model class for Address
 ***/
module.exports = class Address {

  constructor(attributes) {
    if (attributes) {
      this.id = attributes.id || Utils.generateGuid();
      this.city = attributes.city;
      this.state = attributes.state;
      this.apt = attributes.apt;
      this.number = attributes.number;
      this.street = attributes.street;
      this.zipCode = attributes.zipCode;
      this.deleted = attributes.deleted || false;
    }
  }


  set id (id) {
    if (id) {
      if(!Utils.isEmpty(id)) {
        this._id = id;
      } else {
        throw new InputValidationException("id")
      }
    }
  }

  set city (city) {
    if (city) {
      if(!(Utils.isEmpty(city) || Utils.CONTAINS_DIGIT_REGEX.test(city))) {
        this._city = city;
      } else {
        throw new InputValidationException("city")
      }
    }
  }

  set state (state) {
    if (state) {
      if(!(Utils.isEmpty(state) || Utils.CONTAINS_DIGIT_REGEX.test(state))) {
        this._state = state;
      } else {
        throw new InputValidationException("state")
      }
    }
  }

  set apt (apt) {
    if (apt) {
      if(!Utils.isEmpty(apt)) {
        this._apt = apt;
      } else {
        throw new InputValidationException("apt")
      }
    }
  }

  set number (number) {
    if (number) {
      if(!Utils.isEmpty(number)) {
        this._number = number;
      } else {
        throw new InputValidationException("number")
      }
    }
  }

  set street (street) {
    if (street) {
      if(!Utils.isEmpty(street)) {
        this._street = street;
      } else {
        throw new InputValidationException("street")
      }
    }
  }

  set zipCode (zipCode) {
    if (zipCode) {
      if(!Utils.isEmpty(zipCode) && ZIP_CODE_REGEX.test(zipCode)) {
        this._zipCode = zipCode;
      } else {
        throw new InputValidationException("zipCode")
      }
    }
  }

  set deleted (deleted) {
    if (deleted) {
      this._deleted = deleted;  
    }
  }

  get id () {
    return this._id;
  }

  get apt () {
    return this._apt;
  }

  get city () {
    return this._city;
  }

  get state () {
    return this._state;
  }

  get number () {
    return this._number;
  }

  get street () {
    return this._street;
  }

  get zipCode () {
    return this._zipCode;
  }

  get deleted () {
    return this._deleted;
  }

  // To be valid, it must contain all required attributes.
  validate () {
    _.each(VALID_ADDRESS_REQUIRED_ATTRIBUTES, (attribute) => {
      var isValidAttribute = true;

      var hasAttribute = this[attribute];
      if (hasAttribute) {
        var validationOutput;
        if (typeof this[attribute].validate === 'function') {
          validationOutput = this[attribute].validate();
          if (typeof validationOutput === 'boolean') {
            isValidAttribute = isValidAttribute && (validationOutput === true);
          }
        }
        if (typeof this[attribute].isValid === 'function') {
          validationOutput = this[attribute].isValid();
          if (typeof validationOutput === 'boolean') {
            isValidAttribute = isValidAttribute && (validationOutput === true);
          }
        }
      } else {
        isValidAttribute = false;
      }

      if (!isValidAttribute) {
        throw new InputValidationException(attribute);
      }
    });

    return true;
  }
}
