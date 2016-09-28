'use strict';

const Dao = require("../../services/dao");
const daoObject = new Dao("addresses");

/***
 * This class deal with all db interactions of address data
 ***/
module.exports = class AddressModel {

  // TODO - Debate between using constructor init vs static reference
  constructor() {}

  /**
   * Persists data into db. Responsible for validation of incoming data
   * @address - Address to be persisted into DB
   * @callback - callback function
   **/
  static createAddress(address, callback) {

    // TODO - Rework method once we move to id per addres
    validateAddress(address);
    console.log("Validated address: " + JSON.stringify(address));

    var addressDbModel = createDBModel(address);

    daoObject.persist(addressDbModel, callback);
  }

  /**
   * Fetches data from db.
   * @id - Id corresponding to row that needs to be fetched. 
   * If nothing is provided then it returns all the records in the tabls
   * @callback - callback function
   **/
  static fetchAddress(id, callback) {
    var key;
    if (id) {
      key = createAddressKey(id);
    }
    daoObject.fetch(key, callback);
  }

  /**
   * Deletes data from db.
   * @id - Id corresponding to row that needs to be deleted.
   * If nothing is provided then it returns all the records in the tables
   * @callback - callback function
   **/
  static deleteAddress(id, callback) {
    if (!isEmpty(id)) {
      var key = createAddressKey(id);
      daoObject.delete(key, callback);
    } else {
      throw new InputValidationException('id');
    }
  }
};

function createAddressKey(id) {

  var key = {
    "id": id
  };
  return key;
}

/**
 * Generates necessary DB model as understood by DAO
 **/
function createDBModel(address) {

  // This is pseudo GUID. No clean way of getting GUID in JS
  var id = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0,
      v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });

  var item = {
    "id": id,
    "city": address.city,
    "state": address.state,
    "apt": address.apt,
    "number": address.number,
    "street": address.street,
    "zipcode": address.zipcode
  };

  return item;
}


function isEmpty(value) {
  return value === null || value === "";
}

/**
 * Validates address data
 * @throws InputValidationException if data passed is not valid
 **/
function validateAddress(address) {

  var city = address.city;
  var state = address.state;
  var apt = address.apt;
  var number = address.number;
  var street = address.street;
  var zipcode = address.zipcode;

  var containsDigitRegex = /.*[0-9].*/
  var zipcodeRegex = /![0-9]{5,}$/

  if (isEmpty(city) || containsDigitRegex.test(city)) {
    throw new InputValidationException('city');
  }

  if (isEmpty(state) || containsDigitRegex.test(state)) {
    throw new InputValidationException('state');
  }

  if (isEmpty(apt)) {
    throw new InputValidationException('apt');
  }

  if (isEmpty(number)) {
    throw new InputValidationException('number');
  }

  if (isEmpty(street)) {
    throw new InputValidationException('street');
  }

  if (zipcode === null || zipcodeRegex.test(zipcode)) {
    throw new InputValidationException('zipcode');
  }
}

/**
 * Function which encapsulates Input Validation Errors
 **/
function InputValidationException(value) {

  this.value = value;

  this.toString = function() {
    return "Invalid " + this.value;
  };
}
