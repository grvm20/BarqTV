'use strict';

const _ = require('underscore');
const InvalidInputException = require("../exceptions/invalid-input-exception");
const Utils = require("../utilities/utils");


var VALID_ADDRESS_REQUIRED_ATTRIBUTES = [
  "id",
  "city",
  "state",
  "apt",
  "number",
  "street",
  "zipCode",
  "deleted"
];

const isValidCity = (city) => {
  return Utils.isAlphabeticString(city);
}
const isValidState = (state) => {
  return Utils.isAlphabeticString(state);
}
const isValidId = (id) => {
  var isNotEmpty = !Utils.isEmpty(id);
  return isNotEmpty;
}
const isValidZipCode = (zipCode) => {
  const ZIP_CODE_FORMAT_REGEX = /[0-9]{5,}$/;
  var isNotEmpty = !Utils.isEmpty(zipCode);
  var hasZipCodeFormat = ZIP_CODE_FORMAT_REGEX.test(zipCode);
  return isNotEmpty && hasZipCodeFormat
}

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
      if (isValidId(id)) {
        this._id = id;
      } else {
        throw new InvalidInputException("id")
      }
    }
  }

  set city (city) {
    if (city) {
      if (isValidCity(city)) {
        this._city = city;
      } else {
        throw new InvalidInputException("city")
      }
    }
  }

  set state (state) {
    if (state) {
      if (isValidState(state)) {
        this._state = state;
      } else {
        throw new InvalidInputException("state")
      }
    }
  }

  set apt (apt) {
    if (apt) {
      if (!Utils.isEmpty(apt)) {
        this._apt = apt;
      } else {
        throw new InvalidInputException("apt")
      }
    }
  }

  set number (number) {
    if (number) {
      if (!Utils.isEmpty(number)) {
        this._number = number;
      } else {
        throw new InvalidInputException("number")
      }
    }
  }

  set street (street) {
    if (street) {
      if (!Utils.isEmpty(street)) {
        this._street = street;
      } else {
        throw new InvalidInputException("street")
      }
    }
  }

  set zipCode (zipCode) {
    if (zipCode) {
      if (isValidZipCode(zipCode)) {
        this._zipCode = zipCode;
      } else {
        throw new InvalidInputException("zip code")
      }
    }
  }

  set deleted (deleted) {
    if (typeof deleted === 'boolean') {
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
      var hasAttribute = typeof this[attribute] !== 'undefined';
      var isValidAttribute = Utils.isValid(this[attribute]);
      if (!hasAttribute || !isValidAttribute) {
        throw new InvalidInputException(attribute);
      }
    });

    return true;
  }
}