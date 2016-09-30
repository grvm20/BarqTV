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
    building: dbObject.building,
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
    item["city"] = address.city;
  }
  if (address.state) {
    item["state"] = address.state;
  }
  if (address.apt) {
    item["apt"] = address.apt;
  }
  if (address.building) {
    item["building"] = address.building;
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

function constructUpdatableAddress(address) {

  var updatableAddress = new Address();
  if (address.city) {
    console.log(address.city);
    updatableAddress.city = address.city;
  }

  if (address.state) {
    updatableAddress.state = address.state;
  }
  if (address.apt) {
    updatableAddress.apt = address.apt;
  }
  if (address.building) {
    updatableAddress.building = address.building;
  }

  if (address.street) {
    updatableAddress.street = address.street;
  }
  if (address.zipCode) {
    updatableAddress.zipCode = address.zipCode;
  }

  return updatableAddress

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
    var key = createAddressKey(address.id);
    var addressDbModel = mapAddressToDbObject(address);
    this._dao.persist(key, addressDbModel, (err, persistedObject) => {

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
    if (!Utils.isEmpty(id)) {
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

  /**
   * Updates data of db.
   * @id - Id corresponding to row that needs to be updated.
   * @address - address objects which has data that needs to be updated
   * @callback - callback function
   **/
  update(id, address, callback) {
    if (!Utils.isEmpty(id)) {
      var key = createAddressKey(id);
      var updatableAddress = constructUpdatableAddress(address);
      var updatableAddressDbModel = mapAddressToDbObject(updatableAddress);

      this._dao.update(key, updatableAddressDbModel, (err, deletedAddress) => {
        if (err) {
          callback(err);
        } else {

          var addressAttributes = mapDbObjectToAddressAttributes(deletedAddress);

          try {
            var address = new Address(addressAttributes);
          } catch (err) {
            console.log("Error while trying to update data: " + id + ", address: " + JSON.stringify(address));
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