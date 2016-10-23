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
      return callback("Null Object Passed which trying to show data");
    }
  }

  create(params, callback) {
    if (areValidParams(params) && areValidParams(params.address)) {

      var address = this.addressSerializer.deserialize(params.address);

      this.addressService.save(address, (err, savedAddress) => {
        if (err) {
          console.log("Error while trying to save address information: " + JSON.stringify(params.address))
          callback(err);
          return;

        } else {
          this.addressSerializer.render(savedAddress, callback);
          return;
        }
      });
    } else {
      callback("Null or Empty object passed while trying to save data");
    }
  }

  update(params, callback) {

    if (areValidParams(params) && !Utils.isEmpty(params.id) && areValidParams(params.address)) {

      var id = params.id;
      var address = params.address;

      this.addressService.update(id, address, (err, updatedAddress) => {
        if (err) {
          console.log("Error while trying to save address information: " + JSON.stringify(params.address))
          callback(err);
          return;

        } else {
          this.addressSerializer.render(updatedAddress, callback);
          return;
        }
      });
    } else {
      callback("Null or empty id or empty address sent for updation");
    }
  }
};
