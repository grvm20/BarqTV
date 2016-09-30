'use strict';

const _ = require('underscore');
const InputValidationException = require("../exceptions/invalid-input-exception");
const Utils = require("../utilities/utils");

const VALID_ID_REGEX = Utils.VALID_EMAIL_REGEX;
const VALID_CUSTOMER_REQUIRED_ATTRIBUTES = [
  "id",
  "firstName",
  "lastName",
  "phoneNumber",
  "address"
];

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
      if(!Utils.isEmpty(id) && VALID_ID_REGEX.test(id)){
        this._id = id;
      } else {
        throw new InputValidationException("id")
      }
    }
  }
  get id () {
    return this._id;
  }

  set firstName (firstName) {
    if (firstName) {
      if(!Utils.isEmpty(firstName) && !Utils.CONTAINS_DIGIT_REGEX.test(firstName)){
        this._firstName = firstName;
      } else {
        throw new InputValidationException("firstName")
      }
    }
  }
  get firstName () {
    return this._firstName;
  }

  set lastName (lastName) {
    if (lastName) {
      if(!Utils.isEmpty(lastName) && !Utils.CONTAINS_DIGIT_REGEX.test(lastName)){
        this._lastName = lastName;
      } else {
        throw new InputValidationException("lastName")
      }
    }
  }
  get lastName () {
    return this._lastName;
  }

  set address (address) {
    this._address = address;
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
      if(!Utils.isEmpty(phoneNumber) && Utils.CONTAINS_DIGIT_REGEX.test(phoneNumber)){
        this._phoneNumber = phoneNumber;
      } else {
        throw new InputValidationException("PhoneNumber")
      }
    }
  }
  get phoneNumber () {
    return this._phoneNumber;
  }

  set deleted (deleted) {
    this._deleted = deleted;
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
        throw new InputValidationException("email")
      }
    }
  }
  get email () {
    return this.id;
  }

  // To be valid, it must contain all required attributes.
  validate () {
    _.each(VALID_CUSTOMER_REQUIRED_ATTRIBUTES, (attribute) => {
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

