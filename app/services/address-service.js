'use strict';

const _ = require('underscore');

const InputValidationException = require("../exceptions/invalid-input-exception")
const Address = require('../models/address');
const Utils = require("../utilities/utils");

/*
 * TODO: Move these mapping functions to a data layer. The service shouldn't 
 * know about them.
 */
function mapDbObjectToAddressAttributes(dbObject) {
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

function createAddressKey(id) {

  var key = {
    "id": id
  };
  return key;
}

/**
 * Generates necessary DB model as understood by DAO
 **/
function mapAddressToDbObject(address) {

  var item = {
    "id": address.id,
    "city": address.city,
    "state": address.state,
    "apt": address.apt,
    "number": address.number,
    "street": address.street,
    "zip_code": address.zipCode,
    "deleted": address.deleted
  };

  return item;
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
    if (!(address instanceof Address)) {
      var addressAttributes = address;
      if (!addressAttributes.id) {
        var id = Utils.generateGuid();
        addressAttributes.id = id;
      }

      try {
        var address = new Address(addressAttributes);
      } catch (err) {
        callback(err);
      }
    }

    var addressDbModel = mapAddressToDbObject(address);
    this._dao.persist(addressDbModel, (err, persistedObject) => {

      if (err) {
        console.log("Error while trying to save data: " + JSON.stringify(address));
        callback(err);
      } else {
        callback(null, address);
      }
    });
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

    this._dao.fetch(key, (err, fetchedAddress) => {
      if (err) {
        console.log("Error while trying to fetch data: " + id);
        callback(err);
      } else {

        if (_.isArray(fetchedAddress)) {
          var addresses = [];
          fetchedAddress.forEach(function(addressDbObject) {

            var addressAttributes = mapDbObjectToAddressAttributes(addressDbObject);

            try {
              var address = new Address(addressAttributes);
            } catch (err) {
              console.log("Error while trying to fetch data: " + id);
              callback(err);
            }

            addresses.push(address)
          });

          callback(null, addresses);

        } else {
          if (!(Object.keys(fetchedAddress).length === 0)) {
            var addressAttributes = mapDbObjectToAddressAttributes(fetchedAddress);

            try {
              var address = new Address(addressAttributes);
            } catch (err) {
              console.log("Error while trying to fetch data: " + id);
              callback(err);
            }

            callback(null, address);
          } else {
            callback(null, fetchedAddress);
          }
        }
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
      this._dao.delete(key, (err, deletedAddress) => {
        if (err) {
          callback(err);
        } else {

          var addressAttributes = mapDbObjectToAddressAttributes(deletedAddress);

          try {
            var address = new Address(addressAttributes);
          } catch (err) {
            console.log("Error while trying to delete data: " + id);
            callback(err);
          }
          callback(null, address);
        }
      });
    } else {
      throw new InputValidationException('id');
    }
  }
}
