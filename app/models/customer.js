'use strict';

const _ = require('underscore');
const InputValidationException = require("../exceptions/invalid-input-exception");
const Utils = require("../utilities/utils")

var containsDigitRegex = /.*[0-9].*/

var emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

module.exports = class Customer {
  constructor(attributes) {
    // TODO: Allow for partial objects (id and some attributes) to ease
    // validation external usage.
    this.id = attributes.id || attributes.email;
    this.firstName = attributes.firstName;
    this.lastName = attributes.lastName;
    this.phoneNumber = attributes.phoneNumber;
    this.address = attributes.address;
    this.deleted = attributes.deleted || false;
  }

 set id(id){
    if(!Utils.isEmpty(id) && emailRegex.test(id)){
      this._id = id;
    }else{
      throw new InputValidationException("id")
    }
}
  get id() {
    return this._id;
  }

  set firstName(firstName) {
    if(!Utils.isEmpty(firstName) && !containsDigitRegex.test(firstName)){
      this._firstName = firstName;
    }else{
      throw new InputValidationException("firstName")
    }
    }
  get firstName() {
    return this._firstName;
  }

  set lastName(lastName) {
    if(!Utils.isEmpty(lastName) && !containsDigitRegex.test(lastName)){
      this._lastName = lastName;
    }else{
      throw new InputValidationException("lastName")
    }
    
  }
  get lastName() {
    return this._lastName;
  }

  set address(address) {
    this._address = address;
  }
  get address() {
    return this._address;
  }

  get addressRef() {
    return this._address.id;
  }

  set phoneNumber(phoneNumber) {
    if(!Utils.isEmpty(phoneNumber) && containsDigitRegex.test(phoneNumber)){
      this._phoneNumber = phoneNumber;
    }else{
      throw new InputValidationException("PhoneNumber")
    }
    
  }
  get phoneNumber() {
    return this._phoneNumber;
  }

  set deleted(deleted) {
    this._deleted = deleted;
  }
  get deleted() {
    return this._deleted;
  }

  // Id aliases.
  set email(email) {
    if(!Utils.isEmpty(id) && emailRegex.test(id)){
      this._id = email;
    }else{
      throw new InputValidationException("email")
    }
    
  }
  get email() {
    return this.id;
  }

  static isValidId(id) {
    return this.isValidEmail(id);
  }

  static isValidEmail(email) {
    // Validate email.
    return _.isString(email);
  }
}

