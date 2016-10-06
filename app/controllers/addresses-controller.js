'use strict';

const _ = require('underscore');
const Utils = require("../utilities/utils");

function areValidParams(params) {
  return _.isObject(params)
}

module.exports = class AddressController {

  constructor(addressService, addressSerializer) {
    this.addressService = addressService;
    this.addressSerializer = addressSerializer;
  }

  show(params, callback) {
    if (areValidParams(params)) {
      var id = params.id;
      this.addressService.fetch(id, (err, address) => {
        if (err) {
          console.log("Error fetching data for id:" + id);
          callback(err);
        } else {
          this.addressSerializer.render(address, callback);
        }
      });
    } else {
      // Invalid params.
      // Raise error.
    }
  }

  create(params, callback) {
    if (areValidParams(params) && areValidParams(params.address)) {
      this.addressService.save(params.address, (err, savedAddress) => {
        if (err) {
          console.log("Error while trying to save address information: " + JSON.stringify(params.address))
          callback(err);
        } else {
          this.addressSerializer.render(savedAddress, callback);
        }
      });
    } else {
      // raise error
    }
  }

  update(params, callback) {
    var id = params.id;
    var address = params.address;
    if (!Utils.isEmpty(id) && areValidParams(address)) {
      this.addressService.update(id, address, (err, updatedAddress) => {
        if (err) {
          callback(err);
        } else {
          this.addressSerializer.render(updatedAddress, callback);
        }
      });
    } else {
      // raise error
    }
  }

  delete(params, callback) {
    if (areValidParams(params)) {
      var id = params.id;
      this.addressService.delete(id, (err, address) => {
        if (err) {
          console.log("Error while trying to delete address information for id: " + id);
          callback(err);
        } else {
          this.addressSerializer.render(address, callback);
        }
      });
    } else {
      // raise error
    }
  }
};
