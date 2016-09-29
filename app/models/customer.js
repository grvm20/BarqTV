'use strict';

const _ = require('underscore');

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

  set id(id) {
    this._id = id;
  }
  get id() {
    return this._id;
  }

  set firstName(firstName) {
    this._firstName = firstName;
  }
  get firstName() {
    return this._firstName;
  }

  set lastName(lastName) {
    this._lastName = lastName;
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
    if (this._address) {
      return this._address.id;
    } else {
      return null;
    }
  }

  set phoneNumber(phoneNumber) {
    this._phoneNumber = phoneNumber;
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
    this.id = email
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
