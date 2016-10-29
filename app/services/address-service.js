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
    city: dbObject.residential_city,
    state: dbObject.residential_state,
    apt: dbObject.apt,
    number: dbObject.building,
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

  var item = {};
  if (address.id) {
    item["id"] = address.id;
  }
  if (address.city) {
    item["residential_city"] = address.city;
  }
  if (address.state) {
    item["residential_state"] = address.state;
  }
  if (address.apt) {
    item["apt"] = address.apt;
  }
  if (address.number) {
    item["building"] = address.number;
  }
  if (address.street) {
    item["street"] = address.street;
  }
  if (address.zipCode) {
    item["zip_code"] = address.zipCode;
  }
  if (address.deleted != null) {
    item["deleted"] = address.deleted;
  }

  return item;
}

function createPartialAddress(input) {

  var address = new Address();

  if (input.city) {
    address.city = input.city;
  }
  if (input.state) {
    address.state = input.state;
  }
  if (input.apt) {
    address.apt = input.apt;
  }
  if (input.number) {
    address.number = input.number;
  }
  if (input.street) {
    address.street = input.street;
  }
  if (input.zipCode) {
    address.zipCode = input.zipCode;
  }

  return address;
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

  /**
   * Builds an Address object, with all its dependencies. Does not persist it.
   * @input - attributes used to build the Address.
   * Throws InputValidationException.
   **/
  create (input, partialAttributes) {
    if (input instanceof Address) {
      return input;
    } else {
      if(partialAttributes){
        return createPartialAddress(input);
      }else{
        return new Address(input);
      }
    }
  }

  save (address, callback) {
    if (!(address instanceof Address)) {
      var addressAttributes = address;
      try {
        var address = new Address(addressAttributes);
      } catch (err) {
        console.error(err);
        return callback(err);
      }
    }

    var key = createAddressKey(address.id);
    var addressDbModel = mapAddressToDbObject(address);
    this._dao.persist(key, addressDbModel, (err, persistedObject) => {

      if (err) {
        console.log("Error while trying to save data: " + JSON.stringify(address));
        return callback(err);
      } else {
        return callback(null, address);
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
    if (!Utils.isEmpty(id)) {
      key = createAddressKey(id);
    }

    this._dao.fetch(key, (err, fetchedAddress) => {
      if (err) {
        console.log("Error while trying to fetch data: " + id);
        return callback(err);
      } else {

        if (_.isArray(fetchedAddress)) {
          var addresses = [];
          fetchedAddress.forEach(function(addressDbObject) {

            var addressAttributes = mapDbObjectToAddressAttributes(addressDbObject);

            try {
              var address = new Address(addressAttributes);
            } catch (err) {
              console.log("Error while trying to fetch data: " + id);
              return callback(err);
            }

            addresses.push(address)
          });

          return callback(null, addresses);

        } else {
          if (!(Object.keys(fetchedAddress).length === 0)) {
            var addressAttributes = mapDbObjectToAddressAttributes(fetchedAddress);

            try {
              var address = new Address(addressAttributes);
            } catch (err) {
              console.log("Error while trying to fetch data: " + id);
              return callback(err);
            }

            return callback(null, address);
          } else {
            return callback(null, fetchedAddress);
          }
        }
      }
    });
  }
}