'use strict';

const InputValidationException = require("../exceptions/invalid-input-exception")
const Address = require('../models/addresses-model');
const Utils = require("../utilities/utils")

module.exports = class AddressService {

  constructor(dao) {
    this.dao = dao;
  }

  set dao(dao) {
    if (dao) {
      this._dao = dao
    }
  }

  save(address, callback) {

  // TODO - Rework method once we move to id per addres
    var id = generateGUID()
    var city = address.city;
    var state = address.state;
    var apt = address.apt;
    var number = address.number;
    var street = address.street;
    var zipCode = address.zipcode;

    var address = new Address(id, city, state, apt, number, street, zipCode);
    var addressDbModel = createDBModel(address);

    this._dao.persist(addressDbModel, callback);
  }

  /**
   * Fetches data from db.
   * @id - Id corresponding to row that needs to be fetched. 
   * If nothing is provided then it returns all the records in the tabls
   * @callback - callback function
   **/
  fetch(id, callback) {
    var key;
    if (id) {
      key = createAddressKey(id);
    }
    this._dao.fetch(key, callback);
  }

  /**
   * Deletes data from db.
   * @id - Id corresponding to row that needs to be deleted. 
   * If nothing is provided then it returns all the records in the tables
   * @callback - callback function
   **/
  delete(id, callback) {
    if (!Utils.isEmpty(id)) {
        var key = createAddressKey(id);
        this._dao.delete(key, callback);
    } else {
      throw new InputValidationException('id');
    }
  }
}

function generateGUID() {
  // This is pseudo GUID. No clean way of getting GUID in JS
  var id = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
  var r = Math.random() * 16 | 0,
    v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });

  return id;
}

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

  var item = {
    "id": address.id,
    "city": address.city,
    "state": address.state,
    "apt": address.apt,
    "number": address.number,
    "street": address.street,
    "zipcode": address.zipCode
  };

  return item;
}