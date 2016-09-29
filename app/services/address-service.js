'use strict';

const InputValidationException = require("../exceptions/invalid-input-exception")
const Address = require('../models/address');
const Utils = require("../utilities/utils");

/*
 * TODO: Move these mapping functions to a data layer. The service shouldn't 
 * know about them.
 */
function mapDbObjectToAddressAttributes (dbObject) {
  return {
    id: dbObject.id,
    city: dbObject.city,
    state: dbObject.state,
    apt: dbObject.apt,
    number: dbObject.number,
    street: dbObject.street,
    zipCode: dbObject.zip_code
  };
}

function mapAddressToDbObject (address) {
  return {
    id: address.id,
    city: address.city,
    state: address.state,
    apt: address.apt,
    number: address.number,
    street: address.street,
    zip_code: address.zipCode
  }
}

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
    if ( !(address instanceof Address) ) {
      var attributes = address;
      try {
        var address = new Address(attributes);
      } catch (err) {
        callback(err);
      }
    }

    var addressDbModel = mapAddressToDbObject(address);
    this._dao.persist(addressDbModel, callback);
  }

  /**
   * Fetches data from db.
   * @id - Id corresponding to row that needs to be fetched. 
   * If nothing is provided then it returns all the records in the tabls
   * @callback - callback function
   **/
  fetch(id, callback) {
    // TODO: solve also for several addresses returned.
    var key;
    if (id) {
      key = createAddressKey(id);
    }
    this._dao.fetch(key, (err, addressDbObject) => {
      if (err) {
        callback(err);
      } else {
        var addressAttributes = mapDbObjectToAddressAttributes(addressDbObject);

        try {
          var address = new Address(addressAttributes);
        } catch(err) {
          callback(err);
        }

        callback(null, address);
      }
    });
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


function createAddressKey(id) {

  var key = {
    "id": id
  };
  return key;
}

