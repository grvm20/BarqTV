'use strict';

const InputValidationException = require("../exceptions/invalid-input-exception")
const Utils = require("../utilities/utils")

var containsDigitRegex = /.*[0-9].*/
var zipCodeRegex = /[0-9]{5,}$/

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

  set id(id) {
    if (!Utils.isEmpty(id)) {
      this._id = id;
    } else {
      throw new InputValidationException("id")
    }
  }

  set city(city) {
    if (!(Utils.isEmpty(city) || containsDigitRegex.test(city))) {
      this._city = city;
    } else {
      throw new InputValidationException("city")
    }
  }

  set state(state) {
    if (!(Utils.isEmpty(state) || containsDigitRegex.test(state))) {
      this._state = state;
    } else {
      throw new InputValidationException("state")
    }
  }

  set apt(apt) {
    if (!Utils.isEmpty(apt)) {
      this._apt = apt;
    } else {
      throw new InputValidationException("apt")
    }
  }

  set number(number) {
    if (!Utils.isEmpty(number)) {
      this._number = number;
    } else {
      throw new InputValidationException("number")
    }
  }

  set street(street) {
    if (!Utils.isEmpty(street)) {
      this._street = street;
    } else {
      throw new InputValidationException("street")
    }
  }

  set zipCode(zipCode) {
    if (!Utils.isEmpty(zipCode) && zipCodeRegex.test(zipCode)) {
      this._zipCode = zipCode;
    } else {
      throw new InputValidationException("zipCode")
    }
  }

  set deleted(deleted) {
    this._deleted = deleted;
  }

  get deleted() {
    return this._deleted;
  }

  get id() {
    return this._id;
  }

  get apt() {
    return this._apt;
  }

  get city() {
    return this._city;
  }

  get state() {
    return this._state;
  }

  get number() {
    return this._number;
  }

  get street() {
    return this._street;
  }

  get zipCode() {
    return this._zipCode;
  }
}