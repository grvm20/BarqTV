'use strict';

const _ = require('underscore');
const InvalidInputException = require("../exceptions/invalid-input-exception");
const Utils = require("../utilities/utils");

var ZIP_CODE_REGEX = /[0-9]{5,}$/;
var VALID_ADDRESS_REQUIRED_ATTRIBUTES = [
  "id",
  "residential_city",
  "residential_state",
  "apt",
  "building",
  "street",
  "zipCode",
  "deleted"
];

/***
 * Model class for Address
 ***/
module.exports = class Address {

  constructor(attributes) {
    if (attributes) {
      this.id = attributes.id || Utils.generateGuid();
      this.residential_city = attributes.residential_city;
      this.residential_state = attributes.residential_state;
      this.apt = attributes.apt;
      this.building = attributes.building;
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
        throw new InvalidInputException("id")
      }
    }
  }

  set residential_city (residential_city) {
    if (residential_city) {
      if(!(Utils.isEmpty(residential_city) || Utils.CONTAINS_DIGIT_REGEX.test(residential_city))) {
        this._residential_city = residential_city;
      } else {
        throw new InvalidInputException("residential_city")
      }
    }
  }

  set residential_state (residential_state) {
    if (residential_state) {
      if(!(Utils.isEmpty(residential_state) || Utils.CONTAINS_DIGIT_REGEX.test(residential_state))) {
        this._residential_state = residential_state;
      } else {
        throw new InvalidInputException("residential_state")
      }
    }
  }

  set apt (apt) {
    if (apt) {
      if(!Utils.isEmpty(apt)) {
        this._apt = apt;
      } else {
        throw new InvalidInputException("apt")
      }
    }
  }

  set building (building) {
    if (building) {
      if(!Utils.isEmpty(building)) {
        this._building = building;
      } else {
        throw new InvalidInputException("building")
      }
    }
  }

  set street (street) {
    if (street) {
      if(!Utils.isEmpty(street)) {
        this._street = street;
      } else {
        throw new InvalidInputException("street")
      }
    }
  }

  set zipCode (zipCode) {
    if (zipCode) {
      if(!Utils.isEmpty(zipCode) && ZIP_CODE_REGEX.test(zipCode)) {
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

  get residential_city () {
    return this._residential_city;
  }

  get residential_state () {
    return this._residential_state;
  }

  get building () {
    return this._building;
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
