'use strict';

const _ = require('underscore');
const Utils = require("../utilities/utils");

function areValidParams(params) {
  return _.isObject(params)
}

function getUpdationDetails(address, currentAddress) {

  var updateRequired = false;
  _.each(_.keys(address), (key) => {
    if (currentAddress[key] !== address[key]) {
      currentAddress[key] = address[key];
      updateRequired = true;
    }
  });

  var updationDetails = {};
  updationDetails["isUpdateRequired"] = updateRequired;
  updationDetails["updatedAddress"] = currentAddress;
  return updationDetails;

}

module.exports = class AddressController {

  constructor(addressService, addressSerializer, addressNormalizer) {
    this.addressService = addressService;
    this.addressSerializer = addressSerializer;
    this.addressNormalizer = addressNormalizer;
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

      this.addressNormalizer.normalize(address, (err, normalizedAddress) => {
        if (err) {
          console.log("Error while normalizing address");
          callback(err);
          return;
        } else {
          this.addressService.save(normalizedAddress, (err, savedAddress) => {
            if (err) {

              console.log("Error while trying to save address information: " + JSON.stringify(params.address))
              callback(err);
              return;

            } else {

              this.addressSerializer.render(savedAddress, callback);
              return;
            }
          });
        }
      }, this);
    } else {
      callback("Null or Empty object passed while trying to save data");
    }
  }

  update(params, callback) {

    if (areValidParams(params) && !Utils.isEmpty(params.id) && areValidParams(params.address)) {

      var id = params.id;
      var address = params.address;

      address = this.addressSerializer.deserialize(params.address);
      params = _.omit(params, "address");
      // This will validate new entries
      this.addressService.create(address, true);

      this.show(params, (err, currentAddress) => {
        if (err) {
          return callback(err);
        } else {
          var updationDetails = getUpdationDetails(address, currentAddress);

          var isUpdationRequired = updationDetails["isUpdateRequired"];

          if (isUpdationRequired) {

            var params = {};
            var updatedAddress = updationDetails["updatedAddress"];
            params["address"] = updatedAddress;

            this.create(params, (err, address) => {

              if (err) {
                // If get item already exist exception then return updatedAddress
                return callback(err);
              } else {
                // No need to serialize this as this create already returns us serialized object
                return callback(null, address);
              }

            });
          } else {
            console.log("No update required");
            callback("No update required");
            // Throw Exception. Talk to Sarang
          }
        }
      }, this);

    } else {
      callback("Null or empty id or empty address sent for updation");
    }
  }
};
