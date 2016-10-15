'use strict';

const _ = require('underscore');
const InvalidInputException = require("../exceptions/invalid-input-exception");
const Utils = require("../utilities/utils");

const VALID_CUSTOMER_REQUIRED_ATTRIBUTES = [
  "id",
  "firstName",
  "lastName",
  "phoneNumber",
  "address",
  "deleted"
];

const isValidId = (id) => {
  var isNotEmpty = !Utils.isEmpty(id);
  var hasEmailFormat = Utils.VALID_EMAIL_REGEX.test(id);
  return isNotEmpty && hasEmailFormat;
}

const isValidName = (name) => {
  return Utils.isAlphabeticString(name);
};

const isValidPhoneNumber = (phoneNumber) => {
  var isNotEmpty = !Utils.isEmpty(phoneNumber);
  var containsDigits = Utils.CONTAINS_DIGIT_REGEX.test(phoneNumber);
  var isLongEnough = phoneNumber.length > 5;
  var isNotTooLong = phoneNumber.length < 12;
  return isNotEmpty && containsDigits && isLongEnough && isNotTooLong;
};

module.exports = class Customer {
  constructor (attributes) {
    this.id = attributes.id || attributes.email;
    this.firstName = attributes.firstName;
    this.lastName = attributes.lastName;
    this.phoneNumber = attributes.phoneNumber;
    this.address = attributes.address;
    this.deleted = attributes.deleted || false;
  }

  set id (id){
    if (id) {
      if (isValidId(id)){
        this._id = id;
      } else {
        throw new InvalidInputException("id")
      }
    }
  }
  get id () {
    return this._id;
  }

  set firstName (firstName) {
    if (firstName) {
      if (isValidName(firstName)){
        this._firstName = firstName;
      } else {
        throw new InvalidInputException("first name")
      }
    }
  }
  get firstName () {
    return this._firstName;
  }

  set lastName (lastName) {
    if (lastName) {
      if (isValidName(lastName)){
        this._lastName = lastName;
      } else {
        throw new InvalidInputException("last name")
      }
    }
  }
  get lastName () {
    return this._lastName;
  }

  set address (address) {
    if (address) {
      if (Utils.isValid(address)) {
        this._address = address;
      } else {
        throw new InvalidInputException("address")
      }
    }
  }
  get address () {
    return this._address;
  }

  get addressRef () {
    if (this.address) {
      return this._address.id;  
    } else {
      return null;
    }
  }

  set phoneNumber (phoneNumber) {
    if (phoneNumber) {
      if (isValidPhoneNumber(phoneNumber)){
        this._phoneNumber = phoneNumber;
      } else {
        throw new InvalidInputException("phone number")
      }
    }
  }
  get phoneNumber () {
    return this._phoneNumber;
  }

  set deleted (deleted) {
    if (typeof deleted === 'boolean') {
      this._deleted = deleted;  
    }
  }
  get deleted () {
    return this._deleted;
  }

  // Id aliases.
  set email (email) {
    if (email) {
      try {
        this.id = email
      } catch (err) {
        throw new InvalidInputException("email")
      }
    }
  }
  get email () {
    return this.id;
  }

  // To be valid, it must contain all required attributes.
  validate () {
    _.each(VALID_CUSTOMER_REQUIRED_ATTRIBUTES, (attribute) => {
      var hasAttribute = typeof this[attribute] !== 'undefined';
      var isValidAttribute = Utils.isValid(this[attribute]);
      if (!hasAttribute || !isValidAttribute) {
        throw new InvalidInputException(attribute);
      }
    });

    return true;
  }
}

